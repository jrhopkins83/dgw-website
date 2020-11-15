import { LocalStorage } from 'quasar'
import { firebaseStore, firebaseAuth } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
// import storeAuth from './store-auth'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    devMode: 'test',
    leagueInfo: {},
    leagueInfoLoaded: false,
    points: {},
    leagueDates: [],
    userInfo: {},
    leagueID: 1
  }
}

const state = initialState()

const mutations = {
  RESET_LEAGUEINFO (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SET_USER_INFO (state, userInfo) {
    Object.assign(state.userInfo, userInfo)
  },
  SET_LEAGUE_INFO (state, leagueInfo) {
    Object.assign(state.leagueInfo, leagueInfo)
  },
  SET_LEAGUE_DATES (state, value) {
    state.leagueDates = value
  },
  SET_LEAGUE_INFO_LOADED (state, value) {
    state.leagueInfoLoaded = value
  }
}

const actions = {
  saveUserInfoLS ({ state }) {
    LocalStorage.set('userInfo', state.userInfo)
  },
  getUserInfoLS ({ commit }) {
    const userInfo = LocalStorage.getItem('userInfo')
    if (userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  async getSetupInfo ({ commit, dispatch, state }) {
    let success = false
    if (!state.leagueInfo.id) {
      // Get user info
      try {
        const userRecord = firebaseAuth.currentUser
        const userId = userRecord.uid
        const userDoc = await firebaseStore.collection('users').doc(userId).get()

        const playerID = userDoc.data().playerID
        const playerRef = await firebaseStore.collection('players').doc(playerID).get()
        if (playerRef.exists) {
          const userInfo = playerRef.data()
          const idTokenResult = await firebaseAuth.currentUser.getIdTokenResult()

          if (idTokenResult.claims.isAdmin) {
            userInfo.isAdmin = true
          }
          commit('SET_USER_INFO', userInfo)
          dispatch('saveUserInfoLS')
          success = true
        } else {
          const msg = `error, No user found with ID ${userId}`
          showMessage(msg)
          // }
        }
      } catch (error) {
        showMessage('error', 'Error getting setup info:', error)
      }
      return success
    }
  },
  async fbLeagueInfo ({ state, dispatch, commit }) {
    try {
      const leagueID = '1'
      const leagueRef = firebaseStore.collection('leagueInfo').doc(leagueID)
      await dispatch('bindLeagueInfo', leagueRef)
      const datesRef = firebaseStore.collection('eventDates')
      await dispatch('bindLeagueDates', datesRef)
      const pointsRef = firebaseStore.collection('leagueInfo').doc(leagueID).collection('points')
      await dispatch('bindLeaguePoints', pointsRef)
      commit('SET_LEAGUE_INFO_LOADED', true)
    } catch (error) {
      showMessage('error', 'Error getting league Info:', error)
    }
  },

  bindLeagueInfo: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('leagueInfo', ref)
  }),
  unbindLeagueInfo: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('leagueInfo')
  }),
  bindLeagueDates: firestoreAction((context, ref) => {
    context.bindFirestoreRef('leagueDates', ref)
  }),
  unbindLeagueDates: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('leagueDates')
  }),
  bindLeaguePoints: firestoreAction((context, ref) => {
    context.bindFirestoreRef('points', ref)
  }),
  unbindLeaguePoints: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('points')
  }),
  async clearSessionInfo ({ dispatch, commit }) {
    LocalStorage.remove('players')
    LocalStorage.remove('UserInfo')

    commit('players/RESET_PLAYERS', null, {
      root: true
    })

    commit('standings/RESET_STANDINGS', null, {
      root: true
    })
  },

  clearSetupInfo ({ commit, dispatch }) {
    dispatch('clearSessionInfo')
    dispatch('unbindLeagueDates')
    dispatch('unbindLeaguePoints')
    dispatch('unbindLeagueInfo')
    commit('RESET_LEAGUEINFO')

    LocalStorage.remove('leagueInfo')
    LocalStorage.remove('userInfo')
  }
}

const getters = {
  devMode: state => {
    return state.devMode
  },
  leagueInfo: state => {
    return state.leagueInfo
  },
  leagueDates: state => {
    return state.leagueDates
  },
  points: state => {
    return state.points
  },
  leagueCourses: state => {
    return state.leagueCourses
  },
  leagueInfoLoaded: state => {
    return state.leagueInfoLoaded
  },
  userInfo: state => {
    return state.userInfo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
