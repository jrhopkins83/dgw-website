// import Vue from 'vue'
// import { LocalStorage } from 'quasar'
import { firebaseStore } from 'boot/firebase'
// import { showMessage } from 'src/functions/functions-common'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    gameDates: [],
    lastCompletedDate: null,
    gamesLoaded: false,
    gameFilter: ''
  }
}

const state = initialState()

const mutations = {
  RESET_GAMES (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SET_GAMES (state, games) {
    Object.assign(state.gameDates, games)
  },
  SET_LAST_COMPLETED_DATE (state, value) {
    state.lastCompletedDate = value
  },
  SET_GAME_FILTER (state, value) {
    state.gameFilter = value
  },
  SET_GAMES_LOADED (state, value) {
    state.gamesLoaded = value
  }

}

const actions = {
  setGameFilter ({ commit }, value) {
    commit('SET_GAME_FILTER', value)
  },
  async fbGetGames ({ commit, dispatch, state }) {
    let datesRef = firebaseStore.collection('gameDates')
      .orderBy('gameDate')

    await dispatch('bindLeagueDates', datesRef)

    datesRef = firebaseStore.collection('gameDates')
      .orderBy('gameDate', 'desc')
      .where('complete', '==', true)
      .limit(1)
    const dateSnap = await datesRef.get()
    let dateDoc = null
    if (!dateSnap.empty) {
      dateSnap.forEach(doc => {
        dateDoc = doc.data()
      })
      commit('SET_LAST_COMPLETED_DATE', dateDoc.gameDate)
      commit('SET_GAMES_LOADED', true)
    }
    return true
  },
  bindLeagueDates: firestoreAction((context, ref) => {
    context.bindFirestoreRef('gameDates', ref)
  }),
  unbindLeagueDates: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('gameDates')
  }),
  setLastCompletedDate ({ commit }, value) {
    commit('SET_LAST_COMPLETED_DATE', value)
  },
  setGames ({ commit }, games) {
    commit('SET_GAMES', games)
  },
  setGamesLoaded ({ commit }, value) {
    commit('SET_GAMES_LOADED', value)
  },
  reset_players ({ dispatch, commit }) {
    dispatch('unBindPlayersRef')
    // commit('RESET_PLAYERS')
  }
}

const getters = {
  gameDates: state => {
    return state.gameDates
  },
  gamesLoaded: state => {
    return state.gamesLoaded
  },
  lastCompletedDate: state => {
    return state.lastCompletedDate
  },
  gameDatesSorted: (state) => {
    const gameDatesSorted = {},
      keysOrdered = Object.keys(state.gameDates)

    keysOrdered.sort((a, b) => {
      const aDate = state.gameDates[a].gameDate
      const bDate = state.gameDates[b].gameDate

      if (aDate > bDate) return 1
      else if (aDate < bDate) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      const id = state.gameDates[key].id
      gameDatesSorted[id] = state.gameDates[key]
    })

    return gameDatesSorted
  },
  gameDatesFiltered: (state, getters) => {
    const gameDatesSorted = getters.gameDatesSorted,
      gameDatesFiltered = {}
    if (state.gameFilter && state.gameFilter !== 'all') {
      Object.keys(gameDatesSorted).forEach(function (key) {
        const gameDate = gameDatesSorted[key],
          gameDateTypeLowerCase = gameDate.type.toLowerCase(),
          filterLowerCase = state.gameFilter.toLowerCase()
        if (gameDateTypeLowerCase.includes(filterLowerCase)) {
          gameDatesFiltered[key] = gameDate
        }
      })
      return gameDatesFiltered
    }
    return gameDatesSorted
  },
  upcomingGames: (state, getters) => {
    const gameDatesFiltered = getters.gameDatesFiltered
    const gameDates = {}
    const gameDatesKeys = Object.keys(state.gameDates)
    Object.keys(gameDatesFiltered).forEach((key) => {
      if (gameDatesKeys) {
        const date = gameDatesFiltered[key]

        if (!date.complete) {
          gameDates[key] = date
        }
      }
    })
    return gameDates
  },
  completedGames: (state, getters) => {
    const gameDatesFiltered = getters.gameDatesFiltered
    const gameDates = {}
    const gameDatesKeys = Object.keys(state.gameDates)
    Object.keys(gameDatesFiltered).forEach((key) => {
      if (gameDatesKeys) {
        const date = gameDatesFiltered[key]

        if (date.complete) {
          gameDates[key] = date
        }
      }
    })
    // Reverse dates
    const completedGamesKeys = Object.keys(gameDates)
    const completedGamesKeysReversed = completedGamesKeys.reverse()
    const completedGameDates = {}
    let i = 0
    completedGamesKeysReversed.forEach(key => {
      completedGameDates[i++] = gameDates[key]
    })

    return completedGameDates
  },
  lastTournamentDate: (getters) => {
    const completedGames = Object.values(getters.completedGames)
    return completedGames[0].gameDate
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
