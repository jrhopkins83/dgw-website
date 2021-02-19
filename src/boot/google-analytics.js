import ga from 'src/analytics.js'

export default ({ router }) => {
  router.afterEach((to, from) => {
    // eslint-disable-next-line no-undef
    ga.logPage(to.path, to.name, sessionId)
  })
}
