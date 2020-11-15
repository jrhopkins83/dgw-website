const routes = [{
  path: '/',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('pages/PageAuth.vue')
    }, {
      path: '',
      name: 'Home',
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/Index.vue')
    }, {
      path: '/season-standings',
      name: 'season-standings',
      component: () => import('pages/PageSeasonStandings.vue')
    }, {
      path: 'league-info',
      name: 'leagueInfo',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('pages/Admin/PageUpdateLeagueInfo.vue')
    }, {
      path: 'enter-results',
      name: 'EnterResults',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('pages/Admin/PageTournamentResults.vue')
    }
  ]
},

// Always leave this as last one,
// but you can also remove it
{
  path: '*',
  component: () => import('pages/Error404.vue')
}
]

export default routes
