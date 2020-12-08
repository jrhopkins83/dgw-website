import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import Store from 'src/store/index.js'

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
        console.log('store: ', Store)
        if (!Store.getters.loggedIn) {
          next({
            path: '/'
          })
        }
        if (route.meta.requiresAdmin) {
          console.log('isAdmin: ', Store.userInfo.isAdmin)
          if (!Store.userInfo.isAdmin) {
            next(false)
          }
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

export { Store }
