// import Vue from 'vue'
// import { LocalStorage } from 'quasar'
import { firebaseStore } from 'boot/firebase'
// import { showMessage } from 'src/functions/functions-common'
import { firestoreAction, firestoreOptions } from 'vuexfire'

// always wait for bindings to be resolved
firestoreOptions.wait = true

const initialState = () => {
  return {
    announcements: {},
    lastHeroHeadline: null,
    announcementsLoaded: false,
    announcementFilter: ''
  }
}

const state = initialState()

const mutations = {
  RESET_ANNOUNCEMENTS (state) {
    const newState = initialState()
    Object.keys(newState).forEach(key => {
      state[key] = newState[key]
    })
  },
  SET_ANNOUNCEMENTS (state, announcements) {
    Object.assign(state.announcementS, announcements)
  },
  SET_LAST_HERO_HEADLINE (state, value) {
    state.lastHeroHeadline = value
  },
  SET_ANNOUNCEMENT_FILTER (state, value) {
    state.announcementFilter = value
  },
  SET_ANNOUNCEMENTS_LOADED (state, value) {
    state.announcementsLoaded = value
  }

}

const actions = {
  setAnnouncementsFilter ({ commit }, value) {
    commit('SET_ANNOUNCEMENT_FILTER', value)
  },
  async fbGetAnnouncements ({ commit, dispatch, state }) {
    let announcementsRef = firebaseStore.collection('announcements')
      .orderBy('postedDate', 'desc')
      .orderBy('subject', 'asc')

    await dispatch('bindAnnouncements', announcementsRef)

    // Get the latest announcement to use as the headline on the Home page Hero section
    announcementsRef = firebaseStore.collection('announcements')
      .orderBy('postedDate', 'desc')
      .where('heroHeadline', '==', true)
      .limit(1)
    const announcementSnap = await announcementsRef.get()
    let announcementDoc = null
    if (!announcementSnap.empty) {
      announcementSnap.forEach(doc => {
        announcementDoc = doc.data()
      })
      commit('SET_LAST_HERO_HEADLINE', announcementDoc.newsText)
      commit('SET_ANNOUNCEMENTS_LOADED', true)
    }
    return true
  },
  bindAnnouncements: firestoreAction((context, ref) => {
    context.bindFirestoreRef('announcements', ref)
  }),
  unbindAnnouncements: firestoreAction((context, ref) => {
    context.unbindFirestoreRef('announcements')
  }),
  setLastHeroHeadline ({ commit }, value) {
    commit('SET_LAST_HERO_HEADLINE', value)
  },
  setAnnouncements ({ commit }, announcements) {
    commit('SET_ANNOUNCEMENTS', announcements)
  },
  setAnnouncementsLoaded ({ commit }, value) {
    commit('SET_ANNOUNCEMENTS_LOADED', value)
  },
  reset_announcements ({ dispatch, commit }) {
    dispatch('unbindAnnouncements')
    // commit('RESET_PLAYERS')
  }
}

const getters = {
  announcements: state => {
    return state.announcements
  },
  announcementsLoaded: state => {
    return state.announcementsLoaded
  },
  lastHeroHeadline: state => {
    return state.lastHeroHeadline
  },
  announcementsSorted: (state) => {
    const announcementsSorted = {},
      keysOrdered = Object.keys(state.announcements)

    keysOrdered.sort((a, b) => {
      const aDate = state.announcements[a].postedDate
      const bDate = state.announcements[b].postedDate

      if (aDate > bDate) return 1
      else if (aDate < bDate) return -1
      else return 0
    })

    keysOrdered.forEach((key) => {
      const id = state.announcements[key].id
      announcementsSorted[id] = state.announcements[key]
    })

    return announcementsSorted
  },
  announcementsFiltered: (state, getters) => {
    const announcementsSorted = getters.announcementsSorted,
      announcementsFiltered = {}
    if (state.gameFilter) {
      Object.keys(announcementsSorted).forEach(function (key) {
        const postedDate = announcementsSorted[key],
          postedDateTypeLowerCase = postedDate.type.toLowerCase(),
          filterLowerCase = state.gameFilter.toLowerCase()
        if (postedDateTypeLowerCase.includes(filterLowerCase)) {
          announcementsFiltered[key] = postedDate
        }
      })
      return announcementsFiltered
    }
    return announcementsSorted
  },
  lastTournamentDate: (getters) => {
    const completedAnnouncements = Object.values(getters.completedAnnouncements)
    return completedAnnouncements[0].postedDate
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
