import { firestoreAction, firestoreOptions } from 'vuexfire'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    tournamentResultsLoaded: false,
    finishedLoaded: false,
    reorderFlag: false,
    playersReordered: false,
    tournamentInfo: {
      addon: 0,
      buyIn: 0,
      gameDate: null,
      id: '',
      rebuy: 0,
      structure: '',
      type: ''
    },
    tournamentID: '',
    tournamentResults: [],
    numRSVPd: 0,
    numCheckedIn: 0,
    numFinished: 0,
    search: '',
    sortBy: []
  }
}
const state = initialState()

const mutations = {
  RESET_RESULTS (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  RESET_RESULTS_OBJECT (state, key) {
    const newState = initialState()
    state[key] = newState[key]
  },
  SET_SEARCH (state, value) {
    state.search = value
  },
  SET_SORT (state, value) {
    state.sortBy = value
  },
  SET_TOURNAMENT_ID (state, value) {
    state.tournamentID = value
  },
  SET_RESULTS_LOADED (state, value) {
    state.tournamentResultsLoaded = value
  },
  SET_REORDER_FLAG (state, value) {
    state.reorderFlag = value
  },
  SET_PLAYERS_REORDERED (state, value) {
    state.playersReordered = value
  },
  SET_EVENT_INFO (state, value) {
    Object.assign(state.tournamentInfo, value)
  },
  SET_NUM_FINISHED (state, value) {
    state.numFinished = value
  },
  SET_NUM_RSVP (state, value) {
    state.numRSVPd = value
  },
  SET_NUM_CHECKEDIN (state, value) {
    state.numCheckedIn = value
  }
}

const actions = {
  resetResults ({ commit }) {
    commit('RESET_RESULTS')
  },
  resetResultsObject ({ commit }, object) {
    commit('RESET_RESULTS_OBJECT', object)
  },
  async fbTournamentInfo ({ commit }, id) {
    let tournamentInfo = {}
    const tournamentDoc = await firebaseStore.collection('gameDates').doc(id).get()
    if (tournamentDoc.exists) {
      tournamentInfo = tournamentDoc.data()
      tournamentInfo.id = id
    }
    commit('SET_EVENT_INFO', tournamentInfo)
  },
  async fbTourneyResults ({ commit, dispatch, state }, id) {
    try {
      if (id) {
        const resultsRef = firebaseStore.collection('tournamentResults')
          .where('gameID', '==', id)
          .orderBy('onlineName')
        await dispatch('bindResultsRef', resultsRef)
        return commit('SET_RESULTS_LOADED', true)
      }
    } catch (error) {
      switch (error) {
        case 'permission-denied':
          showMessage('error', "You don't have access to this data.")
          break
        case 'not-found':
          showMessage('error', 'Record not found in database')
          break
        default:
          showMessage('error', 'Error getting tournament results: ' + error)
      }
      return error
    }
  },
  bindResultsRef: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('tournamentResults', ref)
  }),
  unbindResultsRef: firestoreAction(async (context) => {
    return await context.unbindFirestoreRef('tournamentResults')
  }),
  setResultsLoaded ({ commit }, value) {
    commit('SET_RESULTS_LOADED', value)
  },
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setSort ({ commit }, property) {
    let sortBy = []
    sortBy = property === 'name' ? [
      { property: 'firstName', direction: 1 },
      { property: 'lastName', direction: 1 }
    ]
      : property === 'checkedIn' ? [
        { property: 'checkedIn', direction: -1 },
        { property: 'onlineName', direction: 1 },
        { property: 'firstName', direction: 1 },
        { property: 'lastName', direction: 1 }
      ]
        : property === 'onlineName' ? [
          { property: 'onlineName', direction: 1 },
          { property: 'firstName', direction: 1 },
          { property: 'lastName', direction: 1 }
        ]
          : property === 'nickName' ? [
            { property: 'nickName', direction: 1 },
            { property: 'firstName', direction: 1 },
            { property: 'lastName', direction: 1 }
          ]
            : [
              { property: 'checkedIn', direction: -1 },
              { property: 'onlineName', direction: 1 }
            ]
    commit('SET_SORT', sortBy)
  },
  async changePlayerCheckin ({ state, commit, dispatch }, payload) {
    try {
      const docID = payload.docID
      const playerRef = firebaseStore.collection('tournamentResults').doc(docID)
      await playerRef.update({
        checkedIn: payload.checkedIn
      })
      let value = 0
      if (payload.checkedIn) {
        value = 1
      } else {
        value = -1
      }

      if (Object.keys(getters.finishedPlayers).length) {
        dispatch('resortFinishedPlayers', value)
        dispatch('setSearch', '')
      }
    } catch (error) {
      showMessage(error)
    }
  },
  async knockoutPlayer ({ commit, dispatch, state, getters }, payload) {
    const numFinished = getters.numFinished
    payload.finishedPosition = state.numCheckedIn - numFinished
    dispatch('setSearch', '')
    await dispatch('updateFinishedPosition', payload)
  },
  async updateFinishedPosition ({ state }, payload) {
    try {
      const docID = payload.docID
      const playerRef = firebaseStore.collection('tournamentResults').doc(docID)
      return await playerRef.update({
        finishedPosition: payload.finishedPosition
      })
    } catch (error) {
      return new Error(error)
    }
  },
  restorePlayer ({ commit, dispatch, state }, payload) {
    commit('RESTORE_PLAYER', payload)
  },
  setNumFinished ({ commit }, value) {
    commit('SET_NUM_FINISHED', value)
  },
  async reorderFinishedPlayers ({ dispatch, getters, commit }, players) {
    if (players) {
      commit('SET_RESULTS_LOADED', false)
      let numCheckedIn = getters.numCheckedIn
      for (let i = players.length - 1; i >= 0; i--) {
        const finishedPosition = numCheckedIn
        const payload = {
          docID: players[i].id,
          finishedPosition: finishedPosition
        }
        await dispatch('updateFinishedPosition', payload)
        --numCheckedIn
      }
      return commit('SET_RESULTS_LOADED', true)
    }
  },
  resortFinishedPlayers ({ dispatch, getters, commit }, value) {
    commit('SET_RESULTS_LOADED', false)
    Object.keys(getters.finishedPlayers).forEach(async key => {
      const oldPosition = getters.finishedPlayers[key].finishedPosition
      const newPosition = oldPosition + value
      const payload = {
        id: key,
        finishedPosition: newPosition
      }
      return await dispatch('updateFinishedPosition', payload)
    })
    return commit('SET_RESULTS_LOADED', true)
  },
  setNumRSVPD ({ commit }, value) {
    commit('SET_NUM_RSVP', value)
  },
  setNumCheckedIn ({ commit }, value) {
    commit('SET_NUM_CHECKEDIN', value)
  },
  setReorderFlag ({ commit }, value) {
    commit('SET_REORDER_FLAG', value)
  },
  setTournamentID ({ commit }, value) {
    commit('SET_TOURNAMENT_ID', value)
  },
  getNumCheckedIn ({ dispatch, commit, state }) {
    let numCheckedIn = 0, numFinished = 0
    const players = Object.values(state.tournamentResults)
    players.forEach((player) => {
      if (player.checkedIn) {
        numCheckedIn++
      }
      if (player.finishedPosition) {
        numFinished++
      }
    })
    commit('SET_NUM_CHECKEDIN', numCheckedIn)
    commit('SET_NUM_FINISHED', numFinished)
  },
  clearResultsInfo ({ commit, dispatch }) {
    dispatch('unbindResultsRef')
    commit('RESET_RESULTS')
  }
}

const getters = {
  tournamentResultsLoaded: state => {
    return state.tournamentResultsLoaded
  },
  finishedLoaded: state => {
    return state.finishedLoaded
  },
  search: state => {
    return state.search
  },
  tournamentResults: state => {
    return state.tournamentResults
  },
  tournamentID: state => {
    return state.tournamentID
  },
  tournamentInfo: state => {
    return state.tournamentInfo
  },
  txtRoundDt: state => {
    return state.txtRoundDt
  },
  reorderFlag: state => {
    return state.reorderFlag
  },
  numFinished: state => {
    return state.numFinished
  },
  numCheckedIn: state => {
    return state.numCheckedIn
  },
  resultsSorted: (state) => {
    const resultsSorted = {},
      keysOrdered = Object.keys(state.tournamentResults)

    keysOrdered.sort((a, b) => {
      let i = 0, result = 0
      while (i < state.sortBy.length && result === 0) {
        const sortByProp = state.sortBy[i].property
        const direction = state.sortBy[i].direction
        const propA = state.tournamentResults[a][sortByProp]
        const propB = state.tournamentResults[b][sortByProp]

        if (propA === b) { result = 0 }
        if (propA === null) {
          result = 1
        } else if (propB === null) {
          result = -1
        } else if (typeof propA === 'string') {
          result = propA.localeCompare(propB)
        } else if (typeof propA === 'number' || typeof propA === 'boolean') {
          if (propA < propB) result = -1
          if (propA > propB) result = 1
        }
        if (direction < 0 && result !== 0) {
          result = result * direction
        }
        i++
      }
      return result
    })

    keysOrdered.forEach((key) => {
      const id = state.tournamentResults[key].playerID
      resultsSorted[id] = state.tournamentResults[key]
    })

    return resultsSorted
  },

  resultsFiltered: (state, getters, commit) => {
    const tournamentResults = getters.resultsSorted,
      resultsFiltered = []

    if (state.search) {
      tournamentResults.forEach((player) => {
        const fullName = `${player.lastName}, ${player.firstName} ${player.nickName} ${player.onlineName}`
        player.fullName = fullName

        const playerNameLowerCase = fullName.toLowerCase()
        const searchLowerCase = state.search.toLowerCase()

        if (playerNameLowerCase.includes(searchLowerCase)) {
          resultsFiltered.push(player)
        }
      })
      return resultsFiltered
    }
    return tournamentResults
  },
  remainingPlayers: (state, getters) => {
    const resultsFiltered = getters.resultsFiltered
    const remainingPlayers = {}
    Object.keys(resultsFiltered).forEach((key) => {
      const player = resultsFiltered[key]
      if (!player.finishedPosition) {
        remainingPlayers[key] = player
      }
    })
    return remainingPlayers
  },
  finishedPlayers: (state, getters) => {
    const resultsFiltered = getters.resultsFiltered
    const finishedPlayers = {}
    Object.keys(resultsFiltered).forEach((key) => {
      const player = resultsFiltered[key]
      if (player.finishedPosition) {
        finishedPlayers[key] = player
      }
    })
    return finishedPlayers
  },
  finishedPlayersSorted: (state, getters) => {
    const finishedSorted = [],
      keysOrdered = Object.keys(getters.finishedPlayers)

    keysOrdered.sort((a, b) => {
      const playerAProp = getters.finishedPlayers[a].finishedPosition
      const playerBProp = getters.finishedPlayers[b].finishedPosition

      if (playerAProp > playerBProp) return 1
      else if (playerAProp < playerBProp) return -1
      else return 0
    })

    let player = null
    keysOrdered.forEach((key) => {
      player = getters.finishedPlayers[key]
      // player.id = key
      finishedSorted.push(player)
    })

    return finishedSorted
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
