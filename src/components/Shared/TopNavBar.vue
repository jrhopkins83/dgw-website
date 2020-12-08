<template>
  <div class="row">
    <q-toolbar class="top-nav q-mx-sm">
      <q-toolbar-title @click="$router.push('/')">
        <div class="logo">
          <span>
            <q-img class="logo__img q-ma-none"
              src="DGW-Logo.png"
            >
            </q-img>
          </span>
          <span class="logo__title gt-xs">
            Where Donkeys Come to Play
          </span>
        </div>
      </q-toolbar-title>
      <template v-if="loggedIn">
        <q-tabs
          class="desktop-menu"
          v-model="tab"
          indicator-color="white"
          active-color="white"
          shrink
          align="right"
          breakpoint="0"
        >
          <q-route-tab
            label = 'Home'
            name = 'home'
            to = '/'
          />
          <q-route-tab
            label = 'Season Standings'
            name = 'standings'
            to = '/season-standings'
          />
          <q-route-tab
            label = 'Weekly Results'
            name = 'weekly-results'
            to = '/weekly-results'
          />
          <q-route-tab
            label = 'Schedule'
            name = ''
            :to = '{ name: "GameSchedule" , params: { mode: "view" } }'
          />
          <q-route-tab
            label = 'Announcements'
            name = 'Announcements'
            to = '/announcements'
          />
          <!-- <q-route-tab
            v-for="nav in userNavs"
            :key="nav.label"
            :label="nav.label"
            :to="nav.to"
            class="q-pa-sm"
          /> -->
          <template v-if="userInfo.isAdmin">
            <q-btn-dropdown
              class="auto-close stretch flat label"
              label="Admin"
              auto-close
              flat
              stretch
            >
              <q-list style="min-width: 27rem">
                <q-item
                  clickable
                  ripple
                  to="/league-info"
                >
                  <q-item-section>
                    LEAGUE INFO
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  :to = '{ name: "GameSchedule" , params: { mode: "edit" } }'
                >
                  <q-item-section>
                    EDIT SCHEDULE
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  to="/"
                >
                  <q-item-section>
                    EDIT PLAYERS
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  to="/"
                >
                  <q-item-section>
                    EDIT ANNOUNCEMENTS
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </q-tabs>
        <q-btn
          class="mobile-menu"
          icon="menu"
          dense
          flat
          round
        >
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
          >
          <q-list style="min-width: 27rem">
            <q-item
              clickable
              ripple
              to="/"
            >
              <q-item-section>
                HOME
              </q-item-section>
            </q-item>
            <q-item
              clickable
              ripple
              to = '/season-standings'
            >
              <q-item-section>
                SEASON STANDINGS
              </q-item-section>
            </q-item>
            <q-item
              clickable
              ripple
              to= "/weekly-results"
            >
              <q-item-section>
                WEEKLY RESULTS
              </q-item-section>
            </q-item>
            <q-item
              clickable
              ripple
              :to = '{ name: "GameSchedule" , params: { mode: "view" } }'
            >
              <q-item-section>
                SCHEDULE
              </q-item-section>
            </q-item>
            <q-item
              clickable
              ripple
              to="/"
            >
              <q-item-section>
                PLAYERS
              </q-item-section>
            </q-item>
            <q-item
              clickable
              ripple
              to="/announcements"
            >
              <q-item-section>
                ANNOUNCEMENTS
              </q-item-section>
            </q-item>
          </q-list>
          </q-menu>
        </q-btn>

        <q-btn
          v-if="loggedIn"
          round
        >
          <q-avatar size="42px">
            <img :src="userInfo.avatar">
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 15rem">
              <q-item clickable @click="updateProfile">
                <q-item-section>Update Profile</q-item-section>
              </q-item>
              <q-item
                v-if="loggedIn"
                @click="logout"
                clickable
              >
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

    </q-toolbar>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      tab: 'home',
      isDesktop: this.$q.platform.is.desktop,
      userNavs: [
        {
          label: 'Home',
          name: 'home',
          to: '/'
        },
        {
          label: 'Season Standings',
          name: 'standings',
          to: 'season-standings'
        },
        {
          label: 'Weekly Results',
          name: 'weekly-results',
          to: ''
        },
        {
          label: 'Schedule',
          // to: 'game-schedule'
          to: "{ name: 'GameSchedule' , params: { mode: 'view' } }"
        // },
        // {
        //   label: 'News',
        //   name: 'news',
        //   to: ''
        // },
        // {
        //   label: 'Players',
        //   name: 'players',
        //   to: ''
        }
      ],
      adminNavs: [
        {
          label: 'LeagueInfo',
          to: 'league-info'
        },

        {
          label: 'Update Schedule',
          to: '{ name: "GameSchedule", params: { mode: "edit" } }'
        // },
        // {
        //   label: 'View RSVPs',
        //   to: 'rsvp'
        // },
        // {
        //   label: 'Edit Players',
        //   to: 'editPlayers'
        // },
        // {
        //   label: 'Edit Announcements',
        //   to: 'editAnnouncements'
        // },
        // {
        //   label: 'Send Message',
        //   to: 'sendMessage'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo'])
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('leagueSettings', ['clearSetupInfo', 'clearLocalStorage']),
    updateSchedule () {
      console.log('update schedule clicked')
    },
    rsvp () {
      console.log('update schedule clicked')
    },
    editPlayers () {
      console.log('update schedule clicked')
    },
    announcements () {
      console.log('update schedule clicked')
    },
    tourneyResults () {
      console.log('update schedule clicked')
    },
    sendMessage () {
      console.log('update schedule clicked')
    },
    updateProfile () {
      console.log('navigate to update profile page')
    },
    async logout () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to logout? ',
        ok: {
          color: 'positive',
          push: true
        },
        cancel: {
          color: 'negative'
        },
        persistent: true
      }).onOk(async () => {
        await this.clearSetupInfo()
        this.logoutUser()
      })
    }
  }
}
</script>

<style lang="scss">

  .top-nav {

    .logo {
        &__img {
          width: 10rem;
          height: 6rem;
          margin-top: .5rem;
          background-size: cover;
          opacity: 1;
        }
        &__title {
          font-size: 1.6rem;
          margin-left: 1rem;
        }
    }

    .q-tab__label {
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
    }
    .nav-item {
        font-size: 16px;
        font-weight: bold;
    }

  }

  @media screen and (max-width: 475px) {
    .top-nav {
      .logo {
          &__title {
            display: none;
          }
      }
    }
  }

  @media screen and (min-width: 476px) {
    .top-nav {
      .logo {
        &__title {
          display: inline-block;
        }
      }
    }
  }

  @media screen and (max-width: 1290px) {
    .top-nav {
      .logo {
        &__img {
          width: 12rem;
          height: 5rem;
          background-size: cover;
          opacity: 1;
        }
      }
    }
    .desktop-menu {
      display: none;
    }
    .mobile-menu {
      display: flex;
    }
  }
  @media screen and (min-width: 1291px) {
    .desktop-menu {
      display: flex;
    }
    .mobile-menu {
      display: none;
    }
  }
</style>
