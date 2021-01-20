<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <div
        class="container schedule-section"
        v-if="gamesLoaded && leagueInfoLoaded"
      >
        <div class="schedule-section__title text-h3 text-bold">
          Game Schedule
        </div>
        <div class="schedule-section__games">
          <div class="schedule-section__games--heading">
            <div :class="isAdmin" class="actions large-screen q-py-none">
              <q-tabs
                v-model="tab"
                dense
                align="left"
                content-class="filter-tabs"
                @input="filterGames"
                :breakpoint="0"
              >
                <q-tab name="all" label="All" content-class="header__filter-tabs"/>
                <q-tab name="mtt" label="MTT" content-class="header__filter-tabs"/>
                <q-tab name="sng" label="SNG" content-class="header__filter-tabs"/>
                <q-tab name="cash" label="Cash"  content-class="header__filter-tabs"/>
              </q-tabs>
            </div>
            <div class="actions mobile q-py-none">
              <q-btn-dropdown
                class="mobile-menu"
                icon="filter_alt"
                auto-close
                dense
                flat
                round
              >
                <q-list style="min-width: 27rem">
                  <q-item
                    clickable
                    ripple
                    @click="setGameFilter('all')"
                  >
                    <q-item-section>
                      ALL
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    ripple
                    @click="setGameFilter('mtt')"
                  >
                    <q-item-section>
                      MTT
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    ripple
                    @click="setGameFilter('sng')"
                  >
                    <q-item-section>
                      SNG
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    ripple
                    @click="setGameFilter('cash')"
                  >
                    <q-item-section>
                      CASH
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
          <div class="schedule-section__games--list" :class="isAdmin">
            <games-list
              :upcomingGames="upcomingGames"
              :completedGames="completedGames"
              :isAdmin="isAdmin"
              :adminButtons="adminButtons"
            >
            </games-list>
          </div>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'GameSchedule',
  components: {
    gamesList: require('components/Schedule/GamesList.vue').default

  },
  props: {
    mode: {
      type: String,
      default: 'view'
    }
  },
  data () {
    return {
      gamesLoaded: true,
      leagueInfoLoaded: true,
      tab: 'all'
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo', 'gameTemplates']),
    ...mapGetters('games', ['gameDates', 'upcomingGames', 'completedGames']),
    isAdmin: function () {
      if (this.userInfo.isAdmin && this.mode === 'edit') {
        return 'isAdmin'
      } else {
        return 'isNotAdmin'
      }
    },
    adminButtons: function () {
      if (this.userInfo.isAdmin && this.mode === 'edit') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions('games', ['setGameFilter']),
    filterGames (value) {
      this.setGameFilter(value)
    }
  },
  async beforeMount () {
    if (!this.userInfo.isAdmin && this.mode === 'edit') {
      this.$router.go(-1)
    }
  },
  destroyed () {
    this.setGameFilter('')
  }

}

</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }
  .schedule-section {
    position: relative;
    height: 100vh;
    padding: 2rem;
    background-color: $lightest-grey;
    background-image: url(card-symbols-stretched.jpg);
    background-repeat: no-repeat;
    background-size: 100% 60%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4rem 1fr;

    &__title {
      grid-row-start: 1;
    }

    .header__filter-tabs {
        font-size: 20px;
        line-height: 1.715em;
        font-weight: 500;
    }

    &__games {
      position: relative;
      grid-row-start: 2;
      max-width: 70rem;
      height: 92%;
      background: $off-white 0% 0% no-repeat padding-box;
      border: 1px solid $light-grey;
      border-radius: 1.7rem;
      opacity: .85;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 3.5rem 1fr;

      &--heading {
        position: relative;
        grid-row-start: 1;
        // height: 1.6rem;
        border-radius: 19px;
        opacity: 1;
        display: grid;
        grid-template-columns: 1fr;

        .actions.large-screen {
          margin-left: 1.6rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .actions.mobile {
          display: none;
        }

      }

      &--list {
        position: relative;
        max-width: 70rem;
        background-color: $off-white;
        border-radius: 1.7rem;
        opacity: .9;
        height: 92%;
        overflow: auto;
      }

      &--list.isAdmin {
        max-width: 75rem;
      }
    }

  }

@media screen and (max-width: 600px) {
  .schedule-section__games--heading {
    grid-template-columns: 1fr .25fr;
  }
}

@media screen and (max-width: 567px) {
  .schedule-section {
    padding: .5rem;
  }
  .schedule-section__games {
    height: 90%;
  }
  .actions.mobile {
    display: block;
  }
}

</style>
