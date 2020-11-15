import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    standingsLoaded: false,
    seasonStandings: [],
    search: ''
  }
}
const state = initialState()

const mutations = {
  RESET_STANDINGS (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  RESET_STANDINGS_OBJECT (state, key) {
    const newState = initialState()
    state[key] = newState[key]
  },
  SET_SEARCH (state, value) {
    state.search = value
  },
  SET_TXT_ROUND_DT (state, value) {
    state.txtRoundDt = value
  },
  SET_STANDINGS_LOADED (state, value) {
    state.standingsLoaded = value
  },
  SET_SEASON_STANDINGS (state, value) {
    Object.assign(state.seasonStandings, value)
  }
}

const actions = {
  resetStandings ({ commit }) {
    commit('RESET_STANDINGS')
  },
  resetStandingsObject ({ commit }, object) {
    commit('RESET_STANDINGS_OBJECT', object)
  },
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setTxtRoundDt ({ commit }, value) {
    commit('SET_TXT_ROUND_DT', value)
  },
  setStandingsLoaded ({ commit }, value) {
    commit('SET_STANDINGS_LOADED', value)
  },
  setSeasonStandings ({ commit }, standings) {
    commit('SET_SEASON_STANDINGS', standings)
  },
  bindStandingsRef: firestoreAction((context, ref) => {
    context.bindFirestoreRef('seasonStandings', ref)
  })
}

const getters = {
  standingsLoaded: state => {
    return state.standingsLoaded
  },
  search: state => {
    return state.search
  },
  seasonStandings: state => {
    return state.seasonStandings
  },
  txtRoundDt: state => {
    return state.txtRoundDt
  },
  standingsSorted: (state, getters) => {
    const keysOrdered = JSON.parse(JSON.stringify(getters.seasonStandings))
    keysOrdered.sort((a, b) => {
      return b.totalPoints - a.totalPoints
    })

    try {
      let position = 1
      let totalPlayers = 1
      const numPlayers = keysOrdered.length
      const rankedPlayers = []

      let a = 0, b = 0, tie = false

      for (let i = 0; i < numPlayers; i++) {
        const newPlayer = keysOrdered[i]
        totalPlayers = ++totalPlayers
        newPlayer.position = position

        if (i < numPlayers - 1) {
          a = keysOrdered[i].totalPoints
          b = keysOrdered[i + 1].totalPoints
          if (a > b) {
            // increase rank before assigning to position if current points < previous points
            if (!tie) {
              position = ++position
              tie = false
            } else {
              position = totalPlayers
            }
          } else if (a === b) {
            // increase rank after assigning to position if they're the same
            tie = true
          }
        }

        newPlayer.name = `${newPlayer.firstName.trim()} ${newPlayer.lastName.trim()}`

        rankedPlayers.push(newPlayer)
      }
      return rankedPlayers
    } catch (error) {
      console.log('Error ranking players: ', error)
      return null
    }
  },
  standingsFiltered: (state, getters, commit) => {
    const standingsSorted = getters.standingsSorted,
      standingsFiltered = []

    if (state.search) {
      standingsSorted.forEach((player) => {
        const fullName = `${player.lastName}, ${player.firstName} ${player.nickName} ${player.onlineName} `
        player.fullName = fullName

        const playerNameLowerCase = fullName.toLowerCase()
        const searchLowerCase = state.search.toLowerCase()

        player.pts_game = Number.parseFloat(player.totalPoints / player.games).toFixed(2)

        if (playerNameLowerCase.includes(searchLowerCase)) {
          standingsFiltered.push(player)
        }
      })
      return standingsFiltered
    }
    return standingsSorted
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
