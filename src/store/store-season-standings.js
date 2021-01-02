import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    standingsLoaded: false,
    seasonStandings: [],
    search: '',
    playerID: ''
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
  SET_PLAYERID (state, value) {
    state.playerID = value
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
  setPlayerID ({ commit }, value) {
    commit('SET_PLAYERID', value)
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
    return context.bindFirestoreRef('seasonStandings', ref)
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
  standingsMerged: (state, getters, rootState, rootGetters) => {
    const players = []
    const standings = []

    for (let i = 0; i < rootState.players.players.length; i++) {
      const player = rootState.players.players[i]
      player.playerID = rootState.players.players[i].id
      players.push(player)
    }

    for (let i = 0; i < state.seasonStandings.length; i++) {
      const standing = state.seasonStandings[i]
      standing.playerID = state.seasonStandings[i].id
      standings.push(standing)
    }

    if (getters.standingsLoaded && players.length && standings.length) {
      const standingsMerged = players.map(player => ({
        ...standings.find((standing) => (standing.playerID === player.playerID) && standing),
        ...player
      }))
      return standingsMerged
    }
  },
  standingsSorted: (state, getters) => {
    if (getters.standingsMerged) {
      const keysOrdered = getters.standingsMerged
      // Add the player id
      const numPlayers = keysOrdered.length
      // for (let i = 0; i < numPlayers; i++) {
      //   keysOrdered[i].id = state.seasonStandings[i].id
      // }
      keysOrdered.sort((a, b) => {
        return b.totalPoints - a.totalPoints
      })

      try {
        let position = 1
        let totalPlayers = 1
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

          rankedPlayers.push(newPlayer)
        }
        return rankedPlayers
      } catch (error) {
        console.log('Error ranking players: ', error)
        return null
      }
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
  },
  playerStandings: (state, getters, commit) => {
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
