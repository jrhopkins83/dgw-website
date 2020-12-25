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
    gameTemplates: {},
    leagueInfoLoaded: false,
    points: {},
    userInfo: {
      avatar: null,
      avatarName: null,
      email: null,
      emailOptin: null,
      firstName: null,
      isAdmin: null,
      lastName: null,
      nickName: null,
      notificationOptin: null,
      onlineName: null,
      phoneNumber: null,
      playerID: null,
      uid: null
    },
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
    state.completedGameDates = value
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
          userInfo.playerID = playerID
          const idTokenResult = await firebaseAuth.currentUser.getIdTokenResult()

          if (idTokenResult.claims.isAdmin) {
            userInfo.isAdmin = true
          } else {
            userInfo.isAdmin = false
          }

          const userRef = await firebaseStore.collection('subscribers').doc(userInfo.playerID).get()
          if (userRef.exists) {
            userInfo.email = userRef.data().email
            userInfo.phoneNumber = userRef.data().phoneNumber
            userInfo.emailOptin = userRef.data().emailOptin
            userInfo.notificationOptin = userRef.data().notificationOptin
          }

          dispatch('setUserInfo', userInfo)
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

      // Get basic league info
      const leagueRef = firebaseStore.collection('leagueInfo').doc(leagueID)
      await dispatch('bindLeagueInfo', leagueRef)

      // Get points assigments by position finished
      const pointsRef = firebaseStore.collection('leagueInfo').doc(leagueID).collection('pointsAssignments').orderBy('position')
      await dispatch('bindLeaguePoints', pointsRef)

      // Get game templates used to add new games
      const templatesRef = firebaseStore.collection('leagueInfo').doc(leagueID).collection('gameTemplates')
        .orderBy('type')
        .orderBy('structure')
      await dispatch('bindGameTemplates', templatesRef)

      // Get completed games
      await dispatch('games/fbGetGames', null, {
        root: true
      })

      // Get players
      await dispatch('players/fbPlayers', null, {
        root: true
      })

      // await dispatch('bindLeagueDates', datesRef)

      return commit('SET_LEAGUE_INFO_LOADED', true)
    } catch (error) {
      return showMessage('error', 'Error getting league Info:', error)
    }
  },

  bindLeagueInfo: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('leagueInfo', ref)
  }),
  unbindLeagueInfo: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('leagueInfo')
  }),
  bindLeaguePoints: firestoreAction((context, ref) => {
    context.bindFirestoreRef('points', ref)
  }),
  unbindLeaguePoints: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('points')
  }),
  bindGameTemplates: firestoreAction((context, ref) => {
    context.bindFirestoreRef('gameTemplates', ref)
  }),
  unbindGameTemplates: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('gameTemplates')
  }),
  setUserInfo ({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  async clearSessionInfo ({ dispatch, commit }) {
    LocalStorage.remove('players')
    LocalStorage.remove('UserInfo')

    // commit('players/RESET_PLAYERS', null, {
    //   root: true
    // })

    commit('standings/RESET_STANDINGS', null, {
      root: true
    })
  },

  clearSetupInfo ({ commit, dispatch }) {
    dispatch('clearSessionInfo')
    dispatch('games/unbindLeagueDates', null, {
      root: true
    })
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
  gameDates: state => {
    return state.gameDates
  },
  points: state => {
    return state.points
  },
  gameTemplates: state => {
    return state.gameTemplates
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
