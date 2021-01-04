import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { Store } from '../store/index.js'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    to.matched.some(route => {
      if (route.meta.requiresAuth) {
        const userInfo = Store.state.leagueSettings.userInfo
        const appLoaded = Store.getters['auth/appLoaded']
        const userloggedIn = Store.getters['auth/loggedIn']

        if (to.name !== 'Auth' && !userloggedIn && appLoaded) {
          next({ name: 'Auth' })
        } else if (route.meta.requiresAdmin && !userInfo.isAdmin) {
          next({ name: 'home' })
        } else {
          next()
        }
      } else {
        next()
      }
    })
  })
  return Router
}
