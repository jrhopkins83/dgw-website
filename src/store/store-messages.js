import { firebaseStore } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    messages: {},
    messagesLoaded: false
  }
}

const state = initialState()

const mutations = {
  RESET_MESSAGES (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SET_MESSAGES_LOADED (state, value) {
    state.messagesLoaded = value
  },
  SET_SEARCH (state, value) {
    state.search = value
  }
}

const actions = {
  setMessagesLoaded ({ commit }, value) {
    commit('SET_MESSAGES_LOADED', value)
  },
  async fbMessages ({ commit, dispatch, state, rootState }) {
    try {
      let msgLimit = rootState.leagueSettings.leagueInfo.messageLimit
      if (!msgLimit) {
        msgLimit = 20 // Use 20 as default
      }
      const messagesRef = firebaseStore.collection('messages')
        .orderBy('timestamp')
        .limit(msgLimit)
      await dispatch('bindMessagesRef', messagesRef)
      return commit('SET_MESSAGES_LOADED', true)
    } catch (error) {
      return showMessage('error', 'Error getting messages document:', error.message)
    }
  },
  bindMessagesRef: firestoreAction((context, ref) => {
    return context.bindFirestoreRef('messages', ref)
  }),
  unBindMessagesRef: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('messages')
  }),
  async addMessage (message) {
  },
  reset_messages ({ dispatch, commit }) {
    dispatch('unBindMessagesRef')
    commit('RESET_MESSAGES')
  }
}

const getters = {
  messages: state => {
    return state.messages
  },
  messagesLoaded: state => {
    return state.messagesLoaded
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
