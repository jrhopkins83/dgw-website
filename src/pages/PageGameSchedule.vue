<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      v-if="gamesLoaded && leagueInfoLoaded"
    >
      <div class="row header">
        <div class="col-12 header__title">
          <div class="header__title text-center text-h3 text-bold q-mt-md">
            Game Schedule
          </div>
        </div>

        <div :class="isAdmin" class="col-12">
          <div>
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
        </div>
      </div>
      <div class="games-section" :class="isAdmin">
        <games-list
          :upcomingGames="upcomingGames"
          :completedGames="completedGames"
          :isAdmin="isAdmin"
          :adminButtons="adminButtons"
        >
        </games-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { firebaseStore } from 'boot/firebase'
// import { showMessage } from 'src/functions/functions-common'
// import { date } from 'quasar'
// import { firebaseStore } from 'src/boot/firebase'

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
  .container {
    height: 100vh;
    background-color: $lightest-grey;
    background-image: url(card-symbols-stretched.jpg);
    background-repeat: no-repeat;
    background-size: 100% 60%;

    .q-tab__label {
        font-size: 20px;
        line-height: 1.715em;
        font-weight: 500;
    }

    .header {
      position: relative;
      width: 100%;

      &__title {
        height: 43px;
      }

      .isAdmin {
        margin-left: 5rem;
      }

      .isNotAdmin {
        margin-left: 7rem;
      }

    }

    .games-section {
      position: relative;
      max-width: 60rem;
      background-color: $off-white;
      border-radius: 1.7rem;
      opacity: .8;
      margin: 3.2rem 7rem;
      height: 75vh;
      overflow: hidden;

    }
    .games-section.isAdmin {
      max-width: 75rem;
    }
  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

      .left-column {
        width: 93%;

        &__search-bar {
          width: 70%;
        }

        &__player-rankings {
          width: 98%;
        }
      }

    }

  }
</style>
