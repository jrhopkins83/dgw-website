export default ({ router, store, Vue }) => {
  router.beforeEach(function (to, _, next) {
    console.log('route: ', to.name)
    if (to.meta.requiresAuth && !store.getters['auth/loggedIn']) {
      console.log('loggedIn: ', store.getters['auth/loggedIn'])
      next('/auth')
    } else if (to.meta.requiresUnauth && store.getters['leagueSettings/userInfo.isAdmin']) {
      console.log('isAdmin: ', store.getters['leagueSettings/userInfo'])
      next('/')
    } else {
      next()
    }
  })
}
