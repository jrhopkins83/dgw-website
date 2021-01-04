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
    </transition>
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
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo', 'leagueInfoLoaded', 'gameDates']),
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements']),
    ...mapGetters('games', ['gameDates', 'upcomingGames', 'completedGames']),
    ...mapGetters('players', ['players', 'playersLoaded'])
  },
  methods: {
    ...mapActions('players', ['setPlayersLoaded', 'fbPlayers']),
    ...mapActions('standings', ['setStandingsLoaded', 'bindStandingsRef']),
    ...mapActions('announcements', ['fbGetAnnouncements', 'setAnnouncementsLoaded']),
    async loadSeasonStandings () {
      try {
        if (this.players.length) {
          this.setPlayersLoaded(true)
        }

        const season = '2020'
        const standingsRef = firebaseStore.collection('seasonStandings')
          .where('season', '==', season)

        await this.bindStandingsRef(standingsRef)

        this.setStandingsLoaded(true)
      } catch (error) {
        switch (error) {
          case 'permission-denied':
            showMessage('error', "You don't have access to standings data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error getting season standings: ' + error)
        }
        this.setStandingsLoaded(true)
      }
    }
  },

  async created () {
    if (this.userInfo.uid) {
      if (!this.standingsLoaded) {
        this.loadSeasonStandings()
      }
      if (!this.announcementsLoaded) {
        await this.fbGetAnnouncements()
      }
    } else {
      this.$router.push({ path: '/auth' })
    }
  },
  async mounted () {
  }

}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

</style>
