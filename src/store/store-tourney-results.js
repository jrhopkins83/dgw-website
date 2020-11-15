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
    tournamentInfo: {},
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
  SET_TXT_ROUND_DT (state, value) {
    state.txtRoundDt = value
  },
  SET_RESULTS_LOADED (state, value) {
    state.resultsLoaded = value
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
  SET_NUM_FINISHED (state, value) {
    state.numFinished = state.numFinished + value
  },
  SET_NUM_RSVP (state, value) {
    state.numRSVPd = value
  },
  SET_NUM_CHECKEDIN (state, value) {
    state.numCheckedIn = value
  },
  REORDER_FINISHED_PLAYERS (state, value) {
    for (let i = 0; state.finishedPlayers.length; i++) {
      state.finishedPlayers[i].finishedPosition = state.finishedPlayers[i].finishedPosition + value
    }
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
  setTxtRoundDt ({ commit }, value) {
    commit('SET_TXT_ROUND_DT', value)
  },
  setResultsLoaded ({ commit }, value) {
    commit('SET_RESULTS_LOADED', value)
  },
  async fbTournamentInfo ({ commit }, nextTourneyDate) {
    let tournamentInfo = {}
    const eventRef = firebaseStore.collection('eventDates')
      .where('date', '==', nextTourneyDate)
      .where('type', '==', 'MTT')
    const snapshot = await eventRef.get()
    if (!snapshot.empty) {
      snapshot.forEach((event) => {
        tournamentInfo = event.data()
        tournamentInfo.id = event.id
      })
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
      let numCheckIn = state.numCheckedIn
      if (payload.checkedIn) {
        numCheckIn = ++numCheckIn
      } else {
        numCheckIn = --numCheckIn
      }
      commit('SET_NUM_CHECKEDIN', numCheckIn)
      dispatch('saveNumCheckedInLS', numCheckIn)
      if (state.finishedPlayers.length) {
        commit('REORDER_FINISHED_PLAYERS', numCheckIn)
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
  },
  async fbResults ({ commit, dispatch, state }, nextTourneyDate) {
    try {
      if (nextTourneyDate) {
        dispatch('getFinishedPlayersLS')
        const resultsRef = firebaseStore.collection('tournamentResults')
          .where('date', '==', nextTourneyDate)
          .orderBy('checkedIn', 'desc')
          .orderBy('onlineName')
          .orderBy('lastName')
          .orderBy('firstName')
        await dispatch('bindResultsRef', resultsRef)
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
    }
  },
  bindResultsRef: firestoreAction((context, ref) => {
    context.bindFirestoreRef('tournamentResults', ref)
  }),
  setNumRSVPD ({ commit }, value) {
    commit('SET_NUM_RSVP', value)
  },
  setNumCheckedIn ({ commit }, value) {
    commit('SET_NUM_CHECKEDIN', value)
  },
  saveNumCheckedInLS ({ state }) {
    LocalStorage.set('numCheckedIn', state.numCheckedIn)
  },
  getNumCheckedIn ({ commit, state }) {
    let numCheckedIn = 0
    const keysOrdered = Object.keys(state.tournamentResults)
    keysOrdered.forEach((key) => {
      if (state.tournamentResults[key].checkedIn) {
        numCheckedIn++
      }
    })

    commit('SET_NUM_CHECKEDIN', numCheckedIn)
  }
}

const getters = {
  resultsLoaded: state => {
    return state.resultsLoaded
  },
  search: state => {
    return state.search
  },
  tournamentResults: state => {
    return state.tournamentResults
  },
  finishedPlayers: state => {
    return state.finishedPlayers
  },
  tournamentInfo: state => {
    return state.evenInfo
  },
  txtRoundDt: state => {
    return state.txtRoundDt
  },
  numCheckedIn: state => {
    return state.numCheckedIn
  },
  numFinished: state => {
    return Object.keys(state.finishedPlayers).length
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
        const fullName = `${player.lastName}, ${player.firstName} ${player.nickName} ${player.onlineName} `
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
