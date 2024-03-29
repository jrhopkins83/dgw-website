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
    leaguePublicInfo: {},
    gameTemplates: {},
    leagueInfoLoaded: false,
    points: {},
    userInfo: {
      avatar: {
        avatarUrl: null,
        avatarName: null
      },
      photo: {
        photoUrl: null,
        phototName: null
      },
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
        let userInfo = {}
        const userRecord = firebaseAuth.currentUser
        const userId = userRecord.uid
        const idTokenResult = await firebaseAuth.currentUser.getIdTokenResult()
        const isAdmin = idTokenResult.claims.isAdmin

        const userDoc = await firebaseStore.collection('users').doc(userId).get()
        if (userDoc.exists) {
          const playerID = userDoc.data().playerID
          const playerRef = await firebaseStore.collection('players').doc(playerID).get()
          if (playerRef.exists) {
            userInfo = playerRef.data()
            userInfo.playerID = playerID
            userInfo.isAdmin = isAdmin
            userInfo.uid = userId

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
            const msg = `error, No player found with ID ${playerID}`
            showMessage(msg)
          }
        } else if (isAdmin) {
          userInfo.isAdmin = isAdmin
          userInfo.email = idTokenResult.claims.email
          dispatch('setUserInfo', userInfo)
          dispatch('saveUserInfoLS')
          success = true
        } else {
          const msg = `error, No user found with ID ${userId}`
          showMessage(msg)
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

      // Get game templates used to add new games for admins only
      if (state.userInfo.isAdmin) {
        const templatesRef = firebaseStore.collection('leagueInfo').doc(leagueID).collection('gameTemplates')
          .orderBy('type')
          .orderBy('structure')
        await dispatch('bindGameTemplates', templatesRef)
      }

      // Get completed games
      await dispatch('games/fbGetGames', null, {
        root: true
      })

      // Get players
      await dispatch('players/fbPlayers', null, {
        root: true
      })

      // Get season standings
      await dispatch('standings/fbSeasonStandings', null, {
        root: true
      })

      // Get announcements
      await dispatch('announcements/fbGetAnnouncements', null, {
        root: true
      })

      commit('SET_LEAGUE_INFO_LOADED', true)
      return true
    } catch (error) {
      return showMessage('error', 'Error getting league Info:', error)
    }
  },

  async fbLeaguePublicInfo ({ state, dispatch, commit }) {
    try {
      const leagueID = '1'

      // Get basic league info
      const leagueRef = firebaseStore.collection('leagueInfo')
        .doc(leagueID)
        .collection('publicInfo')
        .doc('help')
      await dispatch('bindLeaguePublicInfo', leagueRef)
      commit('SET_LEAGUE_INFO_LOADED', true)
      return true
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
  bindLeaguePublicInfo: firestoreAction(async (context, ref) => {
    return await context.bindFirestoreRef('leaguePublicInfo', ref)
  }),
  unbindLeaguePublicInfo: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('leaguePublicInfo')
  }),
  bindLeaguePoints: firestoreAction((context, ref) => {
    return context.bindFirestoreRef('points', ref)
  }),
  unbindLeaguePoints: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('points')
  }),
  bindGameTemplates: firestoreAction((context, ref) => {
    return context.bindFirestoreRef('gameTemplates', ref)
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

    commit('standings/RESET_STANDINGS', null, {
      root: true
    })
  },

  clearSetupInfo ({ commit, dispatch }) {
    dispatch('clearSessionInfo')
    dispatch('announcements/unbindAnnouncements', null, {
      root: true
    })
    dispatch('announcements/unbindHeroHeadline', null, {
      root: true
    })
    dispatch('games/unbindLeagueDates', null, {
      root: true
    })
    dispatch('games/unbindLastComplDate', null, {
      root: true
    })
    dispatch('messages/unBindMessagesRef', null, {
      root: true
    })
    dispatch('players/unBindPlayersRef', null, {
      root: true
    })
    dispatch('players/unBindSubscribersRef', null, {
      root: true
    })
    dispatch('tourneyResults/unbindResultsRef', null, {
      root: true
    })
    dispatch('weeklyResults/unbindResultsRef', null, {
      root: true
    })
    dispatch('weeklyResults/unbindPlayerResultsRef', null, {
      root: true
    })
    dispatch('unbindLeaguePoints')
    dispatch('unbindLeagueInfo')
    dispatch('unbindGameTemplates')
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
  leaguePublicInfo: state => {
    return state.leaguePublicInfo
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
