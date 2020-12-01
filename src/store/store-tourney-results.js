import Vue from 'vue'
import { LocalStorage } from 'quasar'
import { firestoreAction, firestoreOptions } from 'vuexfire'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    resultsLoaded: false,
    finishedLoaded: false,
    reorderFlag: false,
    playersReordered: false,
    tournamentInfo: {
      addon: 0,
      buyIn: 0,
      date: null,
      id: '',
      rebuy: 0,
      structure: '',
      type: ''
    },
    tournamentID: '',
    tournamentResults: [],
    finishedPlayers: {},
    numRSVPd: 0,
    numCheckedIn: 0,
    search: ''
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
  SET_TOURNAMENT_ID (state, value) {
    state.tournamentID = value
  },
  SET_RESULTS_LOADED (state, value) {
    state.resultsLoaded = value
  },
  SET_FINISHED_LOADED (state, value) {
    state.finishedLoaded = value
  },
  SET_REORDER_FLAG (state, value) {
    state.reorderFlag = value
  },
  SET_PLAYERS_REORDERED (state, value) {
    state.playersReordered = value
  },
  SET_RESULTS (state, value) {
    Object.assign(state.seasonStandings, value)
  },
  SET_EVENT_INFO (state, value) {
    Object.assign(state.tournamentInfo, value)
  },
  UPDATE_CHECKED_IN (state, payload) {
    Vue.set(state.tournamentResults[payload.id], 'checkedIn', payload.checkedIn)
  },
  KNOCKOUT_PLAYER (state, payload) {
    Vue.set(state.finishedPlayers, payload.id, payload.player)
    Vue.set(state.finishedPlayers[payload.id], 'finishedPosition', payload.finishedPosition)
  },
  RESTORE_PLAYER (state, payload) {
    Vue.delete(state.finishedPlayers, payload.id)
    Vue.set(state.finishedPlayers[payload.id], 'finishedPosition', null)
  },
  SET_FINISHED_PLAYERS (state, players) {
    Object.assign(state.finishedPlayers, players)
  },
  UPDATE_FINISHED_PLAYERS (state, payload) {
    Vue.set(state.finishedPlayers[payload.id], 'finishedPosition', payload.finishedPosition)
  },
  SET_TOURNAMENT_RESULTS (state, results) {
    Object.assign(state.tournamentResults, results)
  },
  SET_NUM_FINISHED (state, value) {
    state.numFinished = state.numFinished + value
  },
  SET_NUM_RSVP (state, value) {
    state.numRSVPd = value
  },
  SET_NUM_CHECKEDIN (state, value) {
    state.numCheckedIn = value
  },
  REORDER_FINISHED_PLAYERS (state, players) {
    let newPosition = state.numCheckedIn - players.length + 1
    for (let i = 0; i < players.length; i++) {
      const key = players[i].id
      Vue.set(state.finishedPlayers[key], 'finishedPosition', newPosition)
      newPosition++
    }
  },
  RESORT_FINISHED_PLAYERS (state, value) {
    Object.keys(state.finishedPlayers).forEach(key => {
      state.finishedPlayers[key].finishedPosition = state.finishedPlayers[key].finishedPosition + value
    })
  }

}

const actions = {
  resetResults ({ commit }) {
    commit('RESET_RESULTS')
  },
  resetResultsObject ({ commit }, object) {
    commit('RESET_RESULTS_OBJECT', object)
  },
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setResultsLoaded ({ commit }, value) {
    commit('SET_RESULTS_LOADED', value)
  },
  setFinishedLoaded ({ commit }, value) {
    commit('SET_FINISHED_LOADED', value)
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
  async updateCheckedInPlayer ({ state, commit, dispatch }, payload) {
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

      if (Object.keys(state.finishedPlayers).length) {
        // commit('RESORT_FINISHED_PLAYERS', value)
        dispatch('resortFinishedPlayers', value)
      }
    } catch (error) {
      showMessage(error)
    }
  },
  knockoutPlayer ({ commit, dispatch, state, getters }, payload) {
    const numFinished = getters.numFinished
    const finishedPosition = state.numCheckedIn - numFinished
    payload.finishedPosition = finishedPosition
    commit('KNOCKOUT_PLAYER', payload)
    dispatch('setSearch', '')
    dispatch('saveFinishedPlayersLS')
  },
  restorePlayer ({ commit, dispatch, state }, payload) {
    commit('RESTORE_PLAYER', payload)
    dispatch('saveFinishedPlayersLS')
  },
  setNumFinished ({ commit }, value) {
    commit('SET_NUM_FINISHED', value)
  },
  setFinishedPlayers ({ commit }, players) {
    commit('SET_FINISHED_PLAYERS', players)
  },
  reorderFinishedPlayers ({ dispatch, getters, commit }, players) {
    if (players) {
      commit('SET_FINISHED_LOADED', false)
      // commit('REORDER_FINISHED_PLAYERS', players)
      let numCheckedIn = getters.numCheckedIn
      for (let i = players.length - 1; i >= 0; i--) {
        const finishedPosition = numCheckedIn
        const payload = {
          id: players[i].id,
          finishedPosition: finishedPosition
        }
        commit('UPDATE_FINISHED_PLAYERS', payload)
        --numCheckedIn
      }
      dispatch('saveFinishedPlayersLS')
      commit('SET_FINISHED_LOADED', true)
    }
  },
  resortFinishedPlayers ({ dispatch, getters, commit }, value) {
    commit('SET_FINISHED_LOADED', false)
    Object.keys(state.finishedPlayers).forEach(key => {
      const oldPosition = state.finishedPlayers[key].finishedPosition
      const newPosition = oldPosition + value
      const payload = {
        id: key,
        finishedPosition: newPosition
      }
      commit('UPDATE_FINISHED_PLAYERS', payload)
    })
    dispatch('saveFinishedPlayersLS')
    commit('SET_FINISHED_LOADED', true)
  },
  saveFinishedPlayersLS ({ state }) {
    LocalStorage.set('finishedPlayers', state.finishedPlayers)
  },
  getFinishedPlayersLS ({ commit }) {
    const players = LocalStorage.getItem('finishedPlayers')
    if (players) {
      const keys = Object.keys(players)
      const numFinished = keys.length
      commit('SET_FINISHED_PLAYERS', players)
      commit('SET_NUM_FINISHED', numFinished)
    }
    commit('SET_FINISHED_LOADED', true)
  },
  async fbResults ({ commit, dispatch, state }, id) {
    try {
      if (id) {
        const resultsRef = firebaseStore.collection('tournamentResults')
          .where('eventID', '==', id)
          .orderBy('checkedIn', 'desc')
          .orderBy('onlineName')
          .orderBy('lastName')
          .orderBy('firstName')
        await dispatch('bindResultsRef', resultsRef)
        // const snapShot = await resultsRef.get()
        // if (!snapShot.empty) {
        //   dispatch('getFinishedPlayersLS')
        //   const tournamentDocs = []
        //   snapShot.forEach(doc => {
        //     const tournamentDoc = doc.data()
        //     tournamentDoc.id = doc.id
        //     tournamentDocs.push(tournamentDoc)
        //   })
        // commit('SET_TOURNAMENT_RESULTS', tournamentDocs)
        return commit('SET_RESULTS_LOADED', true)
        // }
      }
    } catch (err) {
      switch (err) {
        case 'permission-denied':
          showMessage('error', "You don't have access to this data.")
          break
        case 'not-found':
          showMessage('error', 'Record not found in database')
          break
        default:
          showMessage('error', 'Error getting tournament results: ' + err)
      }
      return err
    }
  },
  bindResultsRef: firestoreAction((context, ref) => {
    context.bindFirestoreRef('tournamentResults', ref)
  }),
  unbindResultsRef: firestoreAction((context) => {
    context.bindFirestoreRef('tournamentResults')
  }),
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
  saveNumCheckedInLS ({ state }) {
    LocalStorage.set('numCheckedIn', state.numCheckedIn)
  },
  getNumCheckedIn ({ dispatch, commit, state }) {
    let numCheckedIn = 0
    const players = Object.values(state.tournamentResults)
    players.forEach((player) => {
      if (player.checkedIn) {
        numCheckedIn++
      }
    })
    commit('SET_NUM_CHECKEDIN', numCheckedIn)
    dispatch('saveNumCheckedInLS')
  },
  clearResultsInfo ({ commit, dispatch }) {
    dispatch('unbindResultsRef')
    commit('RESET_RESULTS')

    LocalStorage.remove('numCheckedIn')
    LocalStorage.remove('finishedPlayers')
  }
}

const getters = {
  resultsLoaded: state => {
    return state.resultsLoaded
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
  finishedPlayers: state => {
    return state.finishedPlayers
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
    return Object.keys(state.finishedPlayers).length
  },
  numCheckedIn: state => {
    return state.numCheckedIn
  },
  resultsSorted: (state) => {
    const resultsSorted = {},
      keysOrdered = Object.keys(state.tournamentResults)

    keysOrdered.sort((a, b) => {
      const playerAName = state.tournamentResults[a].lastName + ', ' + state.tournamentResults[a].firstName
      const playerAProp = playerAName.toLowerCase()
      const playerBName = state.tournamentResults[b].lastName + ', ' + state.tournamentResults[b].firstName
      const playerBProp = playerBName.toLowerCase()

      if (playerAProp > playerBProp) return 1
      else if (playerAProp < playerBProp) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      const id = state.tournamentResults[key].id
      resultsSorted[id] = state.tournamentResults[key]
      resultsSorted[id].fullName = resultsSorted[id].lastName + ', ' + resultsSorted[id].firstName
    })

    return resultsSorted
  },
  resultsFiltered: (state, getters, commit) => {
    const tournamentResults = Object.values(getters.resultsSorted),
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
      const finishedPlayers = Object.keys(state.finishedPlayers)
      if (finishedPlayers) {
        const player = resultsFiltered[key]
        const isFinished = finishedPlayers.some((el) => {
          return el === player.id
        })
        if (!isFinished) {
          remainingPlayers[key] = player
        }
      }
    })
    return remainingPlayers
  },
  finishedPlayersSorted: (state, getters) => {
    const finishedSorted = [],
      keysOrdered = Object.keys(state.finishedPlayers)

    keysOrdered.sort((a, b) => {
      const playerAProp = state.finishedPlayers[a].finishedPosition
      const playerBProp = state.finishedPlayers[b].finishedPosition

      if (playerAProp > playerBProp) return 1
      else if (playerAProp < playerBProp) return -1
      else return 0
    })

    let player = null
    keysOrdered.forEach((key) => {
      player = state.finishedPlayers[key]
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
