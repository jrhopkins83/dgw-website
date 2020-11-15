import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import loggedIn from 'src/store/store-auth'
import UserInfo from 'src/store/store-league-settings'

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
        if (!loggedIn) {
          next({
            path: '/'
          })
        }
      } else if (route.meta.requiresAdmin) {
        if (!UserInfo.isAdmin) {
          next(false)
        }
      } else {
        next()
      }
    })
  })
  return Router
}
