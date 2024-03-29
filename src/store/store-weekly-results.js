import { firestoreAction, firestoreOptions } from 'vuexfire'
import { firebaseStore } from 'boot/firebase'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    weeklyResultsLoaded: false,
    playerResultsLoaded: false,
    weeklyResults: [],
    playerResults: [],
    search: '',
    playerID: ''
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
  SET_PLAYERID (state, value) {
    state.playerID = value
  },
  SET_SEARCH (state, value) {
    state.search = value
  },
  SET_TXT_ROUND_DT (state, value) {
    state.txtRoundDt = value
  },
  SET_WEEKLY_RESULTS_LOADED (state, value) {
    state.weeklyResultsLoaded = value
  },
  SET_PLAYER_RESULTS_LOADED (state, value) {
    state.playerResultsLoaded = value
  },
  SET_WEEKLY_RESULTS (state, value) {
    Object.assign(state.weeklyResults, value)
  }
}

const actions = {
  resetResults ({ commit, dispatch }) {
    commit('RESET_RESULTS')
    dispatch('unbindResultsRef')
    dispatch('unbindPlayerResultsRef')
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
    return commit('SET_WEEKLY_RESULTS_LOADED', value)
  },
  setWeeklyResults ({ commit }, payload) {
    commit('SET_WEEKLY_RESULTS', payload)
  },
  async fbPlayerResults ({ commit, dispatch, state }, playerID) {
    const resultsRef = firebaseStore.collection('weeklyResults')
      .where('playerID', '==', playerID)
      .orderBy('gameDate', 'desc')

    await dispatch('bindPlayerResultsRef', resultsRef)
    commit('SET_PLAYER_RESULTS_LOADED', true)
  },
  async fbWeeklyResults ({ commit, dispatch, state }, gameDate) {
    const resultsRef = firebaseStore.collection('weeklyResults')
      .where('gameDate', '==', gameDate)

    await dispatch('bindWeeklyResultsRef', resultsRef)
    commit('SET_WEEKLY_RESULTS_LOADED', true)
  },
  bindWeeklyResultsRef: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('weeklyResults', ref)
  }),
  unbindResultsRef: firestoreAction((context) => {
    context.unbindFirestoreRef('weeklyResults')
  }),
  bindPlayerResultsRef: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('playerResults', ref)
  }),
  unbindPlayerResultsRef: firestoreAction((context) => {
    context.unbindFirestoreRef('playerResults')
  })

}

const getters = {
  weeklyResultsLoaded: state => {
    return state.weeklyResultsLoaded
  },
  playerResultsLoaded: state => {
    return state.playerResultsLoaded
  },
  search: state => {
    return state.search
  },
  weeklyResults: state => {
    return state.weeklyResults
  },
  playerResults: state => {
    return state.playerResults
  },
  txtRoundDt: state => {
    return state.txtRoundDt
  },
  resultsMerged: (state, getters, rootState, rootGetters) => {
    const players = Object.values(rootState.players.players)
    const results = state.weeklyResults

    if (getters.weeklyResultsLoaded && players.length && results.length) {
      // const resultsMerged = players.map(player => ({
      //   ...results.find((result) => (result.playerID === player.playerID) && result),
      //   ...player
      // }))
      const resultsMerged = mergeByPlayer(players, results)
      return resultsMerged
    } else {
      return results
    }
  },
  resultsSorted: (state, getters) => {
    const resultsSorted = {},
      keysOrdered = Object.keys(getters.resultsMerged)

    keysOrdered.sort((a, b) => {
      if (getters.resultsMerged[a].finishedPosition) {
        const playerAProp = getters.resultsMerged[a].finishedPosition
        const playerBProp = getters.resultsMerged[b].finishedPosition

        if (playerAProp > playerBProp) return 1
        else if (playerAProp < playerBProp) return -1
        else return 0
      }
    })

    keysOrdered.forEach((key) => {
      const id = getters.resultsMerged[key].playerID
      resultsSorted[id] = getters.resultsMerged[key]
    })
    return resultsSorted
  },
  resultsFiltered: (state, getters, commit) => {
    const resultsSorted = getters.resultsSorted,
      keysOrdered = Object.keys(getters.resultsSorted),
      resultsFiltered = []

    if (state.search) {
      keysOrdered.forEach((key) => {
        const player = resultsSorted[key]
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
    return resultsSorted
  }

}
const mergeByPlayer = (arr1, arr2) => {
  const temp = []

  arr1.forEach(x => {
    arr2.forEach(y => {
      if (x.id === y.playerID) {
        temp.push({ ...x, ...y })
      }
    })
  })

  return temp
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
