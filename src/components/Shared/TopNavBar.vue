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
        <div class="desktop-menu tabs">
          <q-btn-toggle
            value="tab"
            flat stretch
            noWrap
            toggle-color="white"
            :options="userNavs"
            @input="navigate"
          />
          <!-- <template> -->
          <template v-if="userInfo.isAdmin">
            <q-btn-dropdown
              class="auto-close stretch flat label"
              style="font-size: 15px"
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
                  :to = '{ name: "Players" , params: { mode: "edit" } }'
                >
                  <q-item-section>
                    EDIT PLAYERS
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  to="/edit-announcements"
                >
                  <q-item-section>
                    EDIT ANNOUNCEMENTS
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </div>
        <q-btn
          icon="chat_bubble_outline"
          round
          flat
          to="/chat"
        >
        </q-btn>
        <q-btn
          icon="help"
          round
          flat
          to="/help"
        >
        </q-btn>
        <div class="mobile-menu">
          <q-btn
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
                :to = '{ name: "Players" , params: { mode: "view" } }'
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
              <template v-if="userInfo.isAdmin">
                <q-btn-dropdown
                  class="auto-close stretch flat label text-bold"
                  style="font-size: 15px"
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
                      :to = '{ name: "Players" , params: { mode: "edit" } }'
                    >
                      <q-item-section>
                        EDIT PLAYERS
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      ripple
                      to="/edit-announcements"
                    >
                      <q-item-section>
                        EDIT ANNOUNCEMENTS
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </template>
            </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-btn
          v-if="loggedIn"
          round
        >
          <q-avatar size="42px">
            <img :src="user_avatar">
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 15rem">
              <q-item
                to="/user-profile"
                clickable
                ripple
              >
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
          value: 'home'
        },
        {
          label: 'Season Standings',
          value: 'SeasonStandings'
        },
        {
          label: 'Weekly Results',
          value: 'WeeklyResults'
        },
        {
          label: 'Schedule',
          value: 'GameSchedule'
        },
        {
          label: 'Players',
          value: 'Players'
        },
        {
          label: 'Announcements',
          value: 'Announcements'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo']),
    user_avatar: function () {
      if (this.userInfo.avatar.avatarUrl) {
        return this.userInfo.avatar.avatarUrl
      } else {
        return 'default.jpg'
      }
    }

  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapActions('leagueSettings', ['clearSetupInfo', 'clearLocalStorage']),
    navigate (page) {
      switch (page) {
        case 'GameSchedule':
          this.$router.push({ name: 'GameSchedule', params: { mode: 'view' } })
          break
        case 'Players':
          this.$router.push({ name: 'Players', params: { mode: 'view' } })
          break
        default:
          this.$router.push({ name: page })
          break
      }
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

    // .tabs {
    //   max-width: 70rem;
    // }

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

  @media screen and (min-width: 1291px) {
    .top-nav {
      .logo {
        &__title {
          display: inline-block;
        }
      }
      .desktop-menu {
        display: flex;
      }
      .mobile-menu {
        display: none;
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
        &__title {
          display: none;
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

</style>
