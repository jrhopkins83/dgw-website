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
      name: 'home',
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/Index.vue')
    }, {
      path: '/season-standings',
      name: 'SeasonStandings',
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/PageSeasonStandings.vue')
    }, {
      path: '/weekly-results',
      name: 'WeeklyResults',
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/PageWeeklyResults.vue')
    }, {
      path: 'game-schedule/:mode',
      name: 'GameSchedule',
      props: true,
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/PageGameSchedule.vue')
    }, {
      path: 'announcements',
      name: 'Announcements',
      props: true,
      meta: {
        requiresAuth: true
      },
      component: () => import('pages/PageAnnouncements.vue')
    }, {
      path: 'league-info',
      name: 'LeagueInfo',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('pages/Admin/PageUpdateLeagueInfo.vue')
    }, {
      path: 'edit-announcements',
      name: 'EditAnnouncements',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('pages/Admin/PageEditAnnouncements.vue')
    }, {
      path: 'enter-payouts',
      name: 'EnterPayouts',
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      },
      component: () => import('pages/Admin/PageTournamentPayouts.vue')
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
