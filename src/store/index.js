import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './store-auth'
import leagueSettings from './store-league-settings'
import players from './store-players'
import weeklyResults from './store-weekly-results'
import tourneyResults from './store-tourney-results'
import standings from './store-season-standings'
import { vuexfireMutations } from 'vuexfire'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
// initial state
const initialState = {
  leagueSettings: leagueSettings.state,
  players: players.state,
  weeklyResults: weeklyResults.state,
  tourneyResults: tourneyResults.state,
  standings: standings.state
}

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      leagueSettings,
      players,
      tourneyResults,
      weeklyResults,
      standings
    },
    mutations: {
      ...vuexfireMutations,
      reset (state) {
        Object.keys(state).forEach(key => {
          Object.assign(state[key], initialState[key])
        })
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
