import Vue from 'vue'
import { LocalStorage } from 'quasar'
import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    players: {},
    subscribers: {},
    search: '',
    playersLoaded: false
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
  ADD_PLAYER (state, payload) {
    Vue.set(state.players, payload.id, payload.player)
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
  async fbPlayers ({ commit, dispatch }) {
    try {
      const playersRef = firebaseStore.collection('players')
      await dispatch('bindPlayersRef', playersRef)
      const subscribersRef = firebaseStore.collection('subscribers')
      await dispatch('bindSubscribersRef', subscribersRef)
      return commit('SET_PLAYERS_DOWNLOADED', true)
    } catch (error) {
      return showMessage('error', 'Error getting document:', error)
    }
  },
  bindPlayersRef: firestoreAction((context, ref) => {
    return context.bindFirestoreRef('players', ref)
  }),
  unBindPlayersRef: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('players')
  }),
  bindSubscribersRef: firestoreAction((context, ref) => {
    return context.bindFirestoreRef('subscribers', ref)
  }),
  unBindSubscribersRef: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('subscribers')
  }),
  reset_players ({ dispatch, commit }) {
    dispatch('unBindPlayersRef')
    dispatch('unBindSubscribersRef')
    commit('RESET_PLAYERS')
  }
}

const getters = {
  players: state => {
    return state.players
  },
  subscribers: state => {
    return state.subscribers
  },
  playersLoaded: state => {
    return state.playersLoaded
  },
  search: state => {
    return state.search
  },
  playersSorted: (state) => {
    const playersSorted = {},
      keysOrdered = Object.keys(state.players)

    keysOrdered.sort((a, b) => {
      const playerAName = state.players[a].lastName + ', ' + state.players[a].firstName
      const playerAProp = playerAName.toLowerCase()
      const playerBName = state.players[b].lastName + ', ' + state.players[b].firstName
      const playerBProp = playerBName.toLowerCase()

      if (playerAProp > playerBProp) return 1
      else if (playerAProp < playerBProp) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      const id = state.players[key].id
      playersSorted[id] = state.players[key]
      playersSorted[id].playerID = id
      playersSorted[id].fullName = playersSorted[id].lastName + ', ' + playersSorted[id].firstName
    })

    return playersSorted
  },
  playersMerged: (state, getters) => {
    const players = Object.values(getters.playersSorted)
    const subscribers = state.subscribers

    if (players.length && subscribers.length) {
      const playersMerged = players.map(player => ({
        ...subscribers.find((subscriber) => (subscriber.id === player.id) && subscriber),
        ...player
      }))
      return playersMerged
    } else {
      return players
    }
  },

  playersFiltered: (state, getters) => {
    const playersMerged = getters.playersSorted,
      playersFiltered = {}
    if (state.search) {
      Object.keys(playersMerged).forEach(function (key) {
        const player = playersMerged[key]
        let nickName = '', onlineName = ''
        if (player.nickName) {
          nickName = player.nickName.toLowerCase()
        }
        if (player.onlineName) {
          onlineName = player.onlineName.toLowerCase()
        }

        const playerNameLowerCase = `${player.lastName.toLowerCase()}, ${player.firstName.toLowerCase()}, ${nickName}, ${onlineName}`,
          searchLowerCase = state.search.toLowerCase()
        if (playerNameLowerCase.includes(searchLowerCase)) {
          playersFiltered[key] = player
        }
      })
      return playersFiltered
    }
    return playersMerged
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
