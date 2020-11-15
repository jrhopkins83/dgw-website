import { date } from 'quasar'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    weeklyResultsLoaded: false,
    weeklyResults: [{
      playerID: null,
      playerNames: null,
      firstName: null,
      lastName: null,
      nickName: null,
      onlineName: null,
      eventID: null,
      position: null,
      points: null,
      prizeMoney: null
    }],
    search: ''
  }
}
const state = initialState()

const mutations = {
  RESET_POINTS (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  RESET_POINTS_OBJECT (state, key) {
    const newState = initialState()
    state[key] = newState[key]
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
  SET_WEEKLY_RESULTS (state, value) {
    Object.assign(state.weeklyResults, value)
  }
}

const actions = {
  resetPoints ({ commit }) {
    commit('RESET_POINTS')
  },
  resetPointsObject ({ commit }, object) {
    commit('RESET_POINTS_OBJECT', object)
  },
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setTxtRoundDt ({ commit }, value) {
    commit('SET_TXT_ROUND_DT', value)
  },
  setWeeklyResultsLoaded ({ commit }, value) {
    commit('SET_WEEKLY_RESULTS_LOADED', value)
  },
  setWeeklyResults ({ commit }, payload) {
    commit('SET_WEEKLY_RESULTS', payload)
  },
  bindScoresRef: firestoreAction((context, ref) => {
    context.bindFirestoreRef('weeklyResults', ref)
  })
}

const getters = {
  holeScoresLoaded: state => {
    return state.holeScoreLoaded
  },
  scorecardsLoaded: state => {
    return state.scorecardsLoaded
  },
  leagueScoresLoaded: state => {
    return state.leagueScoresLoaded
  },
  holeInfo: state => {
    return state.holeInfo
  },
  holeScores: state => {
    return state.holeScores
  },
  scoresSaved: state => {
    return state.scoresSaved
  },
  scoreCardScores: state => {
    return state.scoreCardScores
  },
  scoreCardTotals: state => {
    return state.scoreCardTotals
  },
  txtRoundDt: state => {
    return state.txtRoundDt
  },
  scores: state => {
    return state.scores
  },
  seasonScores: state => {
    return state.seasonScores
  },
  leagueScores: getters => {
    const scores = getters.scores,
      leagueScores = []
    scores.forEach((score) => {
      const fullName = score.lastName + ', ' + score.firstName
      score.fullName = fullName
      score.roundDate = date.formatDate(score.roundDt.toDate(), 'MM/DD/YYYY')
      leagueScores.push(score)
    })
    return leagueScores
  },
  filteredScores: (state, getters) => {
    const leagueScores = getters.leagueScores,
      scoresFiltered = []
    if (state.search) {
      leagueScores.forEach((score) => {
        const golferNameLowerCase = score.lastName.toLowerCase() + ', ' + score.firstName.toLowerCase(),
          searchLowerCase = state.search.toLowerCase()
        if (golferNameLowerCase.includes(searchLowerCase)) {
          scoresFiltered.push(score)
        }
      })
      return scoresFiltered
    }
    return leagueScores
  },
  seasonScoresSorted: getters => {
    const scores = getters.seasonScores,
      seasonScoresArr = []

    let rank = 1

    scores.forEach((score) => {
      const fullName = score.lastName + ', ' + score.firstName
      score.fullName = fullName
      score.rank = rank++
      // score.txtLastPlayedDt = date.formatDate(score.lastDatePlayed.toDate(), 'DD-MM-YYYY')
      seasonScoresArr.push(score)
    })
    return seasonScoresArr
  },
  seasonScoresFiltered: (state, getters) => {
    const leagueScores = getters.seasonScoresSorted,
      scoresFiltered = []
    if (state.search) {
      leagueScores.forEach((score) => {
        const golferNameLowerCase = score.lastName.toLowerCase() + ', ' + score.firstName.toLowerCase(),
          searchLowerCase = state.search.toLowerCase()
        if (golferNameLowerCase.includes(searchLowerCase)) {
          scoresFiltered.push(score)
        }
      })
      return scoresFiltered
    }
    return leagueScores
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
