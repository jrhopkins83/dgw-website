import Vue from 'vue'
import { LocalStorage } from 'quasar'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    players: {

    },
    addedPlayers: {

    },
    removedPlayers: {

    },
    search: '',
    playersLoaded: false,
    numPlayers: 0,
    status: 'empty'
  }
}

const state = initialState()

const mutations = {
  RESET_PLAYERS (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SET_PLAYERS (state, players) {
    Object.assign(state.players, players)
  },
  SET_ADDEDPLAYER (state, payload) {
    Vue.set(state.addedPlayers, payload.id, payload.golfer)
  },
  SET_REMOVEDPLAYER (state, payload) {
    Vue.set(state.removedPlayers, payload.id, payload.golfer)
  },
  ADD_PLAYER (state, payload) {
    Vue.set(state.players, payload.id, payload.golfer)
  },
  UPDATE_PLAYER_TOTAL (state, payload) {
    // Vue.set(state.players, payload.id, payload.player)
    state.players[payload.id].cumScore = payload.cumScore
  },
  DELETE_PLAYER (state, payload) {
    Vue.delete(state.players, payload.id)
  },
  UPDATE_PLAYER (state, payload) {
    const index = state.players.findIndex(item => item.id === payload.id)
    Vue.set(state.players, index, payload)
    state.players.splice(index, 1, payload)
  },
  DELETE_ADDEDPLAYER (state, payload) {
    Vue.delete(state.addedPlayers, payload.id)
  },
  DELETE_REMOVEDPLAYER (state, payload) {
    Vue.delete(state.removedPlayers, payload.id)
  },
  SET_PLAYERS_DOWNLOADED (state, value) {
    state.playersLoaded = value
  },
  SET_SEARCH (state, value) {
    state.search = value
  },
  SET_NUMPLAYERS (state, value) {
    state.numPlayers = value
  }
}

const actions = {
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setPlayers ({ commit }, players) {
    commit('SET_PLAYERS', players)
  },
  setPlayersLoaded ({ commit }, value) {
    commit('SET_PLAYERS_DOWNLOADED', value)
  },
  setAddedPlayer ({ commit }, payload) {
    commit('SET_ADDEDPLAYER', payload)
  },
  updatePlayerTotal ({ commit, dispatch }, payload) {
    commit('UPDATE_PLAYER_TOTAL', payload)
    dispatch('savePlayersLS')
  },
  setRemovedPlayer ({ commit }, payload) {
    commit('SET_REMOVEDPLAYER', payload)
  },
  deleteAddedPlayer ({ commit }, payload) {
    commit('DELETE_ADDEDPLAYER', payload)
  },
  deleteRemovedPlayer ({ commit }, payload) {
    commit('DELETE_REMOVEDPLAYER', payload)
  },
  selectPlayer ({ commit, dispatch, state }, payload) {
    let numPlayers = state.numPlayers
    numPlayers = numPlayers + 1
    commit('ADD_PLAYER', payload)
    dispatch('setSearch', '')
    dispatch('setNumPlayers', numPlayers)
    dispatch('savePlayersLS')
  },
  deselectPlayer ({ commit, dispatch, state }, payload) {
    let numPlayers = state.numPlayers
    numPlayers = numPlayers - 1
    commit('DELETE_PLAYER', payload)
    dispatch('setNumPlayers', numPlayers)
    dispatch('savePlayersLS')
  },
  setNumPlayers ({ commit }, value) {
    commit('SET_NUMPLAYERS', value)
  },
  savePlayersLS ({ state }) {
    LocalStorage.set('players', state.players)
  },
  getPlayersLS ({ commit }) {
    const players = LocalStorage.getItem('players')
    if (players) {
      const keys = Object.keys(players)
      const numPlayers = keys.length
      commit('SET_PLAYERS', players)
      commit('SET_NUMPLAYERS', numPlayers)
    }
  },
  async fbPlayers ({ commit, dispatch }, leagueID) {
    if (leagueID) {
      try {
        const playersRef = firebaseStore.collection('players')
          .where('leagueID', '==', leagueID)
          .orderBy('lastName')
        await dispatch('bindPlayersRef', playersRef)
        commit('SET_PLAYERS_DOWNLOADED', true)
      } catch (error) {
        commit('SET_PLAYERS_DOWNLOADED', false)
        showMessage('error', 'Error getting document:', error)
      }
    }
  },
  bindPlayersRef: firestoreAction((context, ref) => {
    context.bindFirestoreRef('players', ref)
  }),
  unBindPlayersRef: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('players')
  }),
  async fbUpdateGolfer ({ commit }, golfer) {
    var docRef = firebaseStore.collection('players').doc(golfer.playerID)
    if (golfer.primaryEmail) {
      const email = golfer.primaryEmail
      return docRef.update({
        firstName: golfer.firstName,
        lastName: golfer.lastName,
        primaryEmail: email,
        fullHandicap: golfer.fullHandicap
      })
    } else {
      return docRef.update({
        firstName: golfer.firstName,
        lastName: golfer.lastName,
        fullHandicap: golfer.fullHandicap
      })
    }
  },
  reset_players ({ dispatch, commit }) {
    dispatch('unBindPlayersRef')
    commit('RESET_PLAYERS')
  }
}

const getters = {
  players: state => {
    return state.players
  },
  addedPlayers: state => {
    return state.addedPlayers
  },
  removedPlayers: state => {
    return state.removedPlayers
  },
  numPlayers: state => {
    return state.numPlayers
  },
  playersSorted: (state) => {
    const playersSorted = {},
      keysOrdered = Object.keys(state.players)

    keysOrdered.sort((a, b) => {
      const golferAName = state.players[a].lastName + ', ' + state.players[a].firstName
      const golferAProp = golferAName.toLowerCase()
      const golferBName = state.players[b].lastName + ', ' + state.players[b].firstName
      const golferBProp = golferBName.toLowerCase()

      if (golferAProp > golferBProp) return 1
      else if (golferAProp < golferBProp) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      const id = state.players[key].id
      playersSorted[id] = state.players[key]
      playersSorted[id].fullName = playersSorted[id].lastName + ', ' + playersSorted[id].firstName
    })

    return playersSorted
  },
  playersFiltered: (state, getters) => {
    const playersSorted = getters.playersSorted,
      playersFiltered = {}
    if (state.search) {
      Object.keys(playersSorted).forEach(function (key) {
        const golfer = playersSorted[key],
          golferNameLowerCase = golfer.lastName.toLowerCase() + ', ' + golfer.firstName.toLowerCase(),
          searchLowerCase = state.search.toLowerCase()
        if (golferNameLowerCase.includes(searchLowerCase)) {
          playersFiltered[key] = golfer
        }
      })
      return playersFiltered
    }
    return playersSorted
  },
  availablePlayers: (state, getters) => {
    const playersFiltered = getters.playersFiltered
    const players = {}
    Object.keys(playersFiltered).forEach((key) => {
      const selectedPlayers = Object.keys(state.players)
      if (selectedPlayers) {
        const golfer = playersFiltered[key]
        const isSelected = selectedPlayers.some((el) => {
          return el === key
        })
        if (!isSelected) {
          players[key] = golfer
        }
      }
    })
    return players
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
