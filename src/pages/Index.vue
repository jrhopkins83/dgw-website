<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <template v-if="leagueInfoLoaded && playersLoaded && standingsLoaded">
        <q-page style="min-height: inherit;">
          <div class="row">
            <div class="col">
              <hero-section
                :bank="leagueInfo.bank"
              >
              </hero-section>
            </div>
          </div>
          <div class="row">
            <div class="col gt-md">
              <home-player-of-the-year
                :standings="standingsFiltered"
              >
              </home-player-of-the-year>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-upcoming-games></home-upcoming-games>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-leader-board
                :standings="standingsFiltered"
              >
              </home-leader-board>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-news></home-news>
            </div>
          </div>
        </q-page>
      </template>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  components: {
    heroSection: require('components/HomePage/HomeHeroSection.vue').default,
    homePlayerOfTheYear: require('components/HomePage/HomePlayerOfTheYear.vue').default,
    homeLeaderBoard: require('components/HomePage/HomeLeaderBoard.vue').default,
    homeUpcomingGames: require('components/HomePage/HomeUpcomingGames.vue').default,
    homeNews: require('components/HomePage/HomeNews.vue').default
  },
  computed: {
    ...mapGetters('standings', ['seasonStandings', 'standingsSorted', 'standingsFiltered', 'standingsLoaded']),
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo', 'leagueInfoLoaded', 'gameDates']),
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements']),
    ...mapGetters('games', ['gameDates', 'upcomingGames', 'completedGames']),
    ...mapGetters('players', ['players', 'playersLoaded'])
  },
  methods: {

  }

}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

</style>
