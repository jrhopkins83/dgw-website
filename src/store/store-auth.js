/* eslint-disable handle-callback-err */
/* eslint-disable no-empty-pattern */
import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth, firebaseFunctions } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

const state = {
  loggedIn: false,
  newUser: false,
  LoginError: {
    errorCode: null,
    errorMessage: null
  }
}

const mutations = {
  SET_LOGGEDIN (state, value) {
    state.loggedIn = value
  },
  SET_NEW_USER (state, value) {
    state.newUser = value
  },
  SET_ERROR_MESSAGE (state, payload) {
    state.LoginError = {
      errorCode: payload.errorCode,
      errorMessage: payload.errorMessage
    }
  }
}

const actions = {
  loginUser ({ commit }, payload) {
    Loading.show()
    //   firebaseAuth.signInAnonymously()
    // } else {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        const LoginError = {
          errorCode: null,
          errorMessage: null
        }
        commit('SET_ERROR_MESSAGE', LoginError)
      })
      .catch(error => {
        const errorCode = error.code
        let returnError = {}
        switch (errorCode) {
          case 'auth/wrong-password':
            returnError = {
              errorCode: errorCode,
              errorMessage: 'Wrong password.'
            }
            break
          case 'auth/too-many-requests':
            returnError = {
              errorCode: errorCode,
              errorMessage: 'Forgot password? Click Reset to receive a reset password e-mail'
            }
            break
          case 'auth/user-not-found':
            returnError = {
              errorCode: errorCode,
              errorMessage: 'e-mail not found.  Correct it or click on the Register tab to sign up.'
            }
            break
          default:
            returnError = {
              errorCode: errorCode,
              errorMessage: error.message
            }
        }
        commit('SET_ERROR_MESSAGE', returnError)
      })
    Loading.hide()
  },
  logoutUser ({ dispatch }) {
    firebaseAuth.signOut()
  },
  async handleAuthStateChange ({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged(async user => {
      Loading.show()

      if (user) {
        if (!state.newUser) {
          // eslint-disable-next-line handle-callback-err
          const success = await dispatch('leagueSettings/getSetupInfo', null, {
            root: true
          })
          if (success) {
            await dispatch('leagueSettings/fbLeagueInfo', null, {
              root: true
            })
          }
          Loading.hide()
          this.$router.push('/').catch(error => { })
        }
        commit('SET_LOGGEDIN', true)
        LocalStorage.set('loggedIn', true)
      } else {
        // TO-DO: clear out data
        commit('SET_LOGGEDIN', false)
        LocalStorage.set('loggedIn', false)
        // eslint-disable-next-line handle-callback-err
        Loading.hide()
        this.$router.push({ path: '/auth' })
      }
    })
  },
  setNewUser ({ commit }, value) {
    commit('SET_NEW_USER', value)
  },
  makeAdmin ({ }, adminEmail) {
    const addAdminRole = firebaseFunctions.httpsCallable('addAdminRole')
    addAdminRole({
      email: adminEmail
    }).then(result => {
      showMessage('error', 'Make Admin result: ', result)
    })
  },
  sendReset ({ commit }, email) {
    // Have Firebase Auth send a reset e-mail
    firebaseAuth.sendPasswordResetEmail(email)
      .then(() => {
        const LoginError = {
          errorCode: null,
          errorMessage: null
        }
        commit('SET_ERROR_MESSAGE', LoginError)
        showMessage('error', 'Look in your email inbox for a link to reset your password.')
      }).catch(function (error) {
        // An error happened.
        alert('Error requesting reset')
      })
  }
}
const getters = {
  LoginError: state => {
    return state.LoginError
  },
  loggedIn: state => {
    return state.loggedIn
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
