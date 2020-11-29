<template>
  <div>
    <template v-if="leagueInfoLoaded">
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
            <home-leader-board
              :standings="standingsFiltered"
            >
            </home-leader-board>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <home-upcoming-games></home-upcoming-games>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <home-news></home-news>
          </div>
        </div>
      </q-page>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showMessage } from 'src/functions/functions-common'
import { firebaseStore } from 'boot/firebase'

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
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded', 'gameDates']),
    ...mapGetters('games', ['gameDates', 'upcomingGames', 'completedGames'])
  },
  methods: {
    ...mapActions('standings', ['setStandingsLoaded', 'bindStandingsRef']),
    async loadSeasonStandings () {
      try {
        const season = '2020'
        const standingsRef = firebaseStore.collection('seasonStandings')
          .where('season', '==', season)
          .orderBy('totalPoints', 'desc')
          .orderBy('lastName')

        await this.bindStandingsRef(standingsRef)

        this.setStandingsLoaded(true)
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to standings data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error getting season standings: ' + err)
        }
        this.setStandingsLoaded(true)
      }
    }
  },

  async created () {
    this.loadSeasonStandings()
  }

}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

</style>
