<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <div
        class="container"
        v-if="weeklyResultsLoaded && gamesLoaded && playersLoaded"
      >
        <div class="left-column">
          <div class="left-column__header text-white">
            <div class="left-column__header--title text-h3">
              Weekly Results for the week of
            </div>
            <div class="left-column__header--date date">
              <modal-pick-date
                :pickDate="txtPickDate"
                :gameDates="gameDates"
                @updateGameDate="updateGameDate"
              />
            </div>
          </div>
          <div class="left-column__search-bar q-pa-xs q-ma-md">
            <search>
            </search>
          </div>
          <div class="left-column__player-rankings">
            <player-rankings
              :weeklyResults="resultsFiltered"
            >
            </player-rankings>
          </div>
        </div>
        <div class="right-column gt-sm">
          <div class="right-column__image"></div>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
import { Timestamp } from 'boot/firebase'

export default {
  name: 'PageWeeklyResults',
  components: {
    playerRankings: require('components/Rankings/WeeklyResults.vue').default,
    modalPickDate: require('src/components/Modals/ModaPickDate.vue').default,
    search: require('components/Rankings/SearchResults.vue').default
  },
  data () {
    return {
      gameDate: null,
      pickDate: null
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    ...mapGetters('games', ['completedGames', 'gamesLoaded', 'gameDates']),
    ...mapGetters('weeklyResults', ['search', 'weeklyResultsLoaded', 'resultsFiltered']),
    ...mapGetters('players', ['playersLoaded', 'playersFiltered']),
    ...mapGetters('tournamentResults', ['tournamentInfo']),
    completedGamesArr: function () {
      return Object.values(this.completedGames)
    },
    txtPickDate: function () {
      return date.formatDate(this.gameDate.toDate(), 'MM / DD')
    }
  },
  methods: {
    ...mapActions('weeklyResults', ['fbWeeklyResults', 'setResultsLoaded', 'setSearch']),
    ...mapActions('tournamentResults', ['fbTournamentInfo']),
    ...mapActions('games', ['fbGetGames']),
    updateGameDate (date) {
      this.pickDate = date
      const txtGameDate = date + ' 19:00:00'
      this.gameDate = Timestamp.fromDate(new Date(txtGameDate))
      this.fbWeeklyResults(this.gameDate)
    },
    async getResults () {
      if (this.completedGamesArr[0].gameDate) {
        this.gameDate = this.completedGamesArr[0].gameDate
        await this.fbWeeklyResults(this.gameDate)
        if (this.resultsFiltered.length) {
          this.setResultsLoaded(true)
        }
      }
    }
  },

  async mounted () {
    if (Object.keys(this.completedGames).length) {
      this.getResults()
    } else {
      await this.fbGetGames()
      this.getResults()
    }
  },
  destroyed () {
    this.setSearch('')
  }
}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

  .container {
    position: relative;
    color: black;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: grid;
    grid-template-columns: 6fr 4fr;
    align-items: flex-start;
    // overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent linear-gradient(228deg, #AA0604 0%, #550302 100%) 0% 0% no-repeat padding-box;
      background-repeat: no-repeat;
      // background-size: 60% 100%;
    }

    .left-column {
      width: 100%;
      height: 100vh;
      position: relative;

      &__header {
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        align-items: center;
        gap: 2rem;
        margin-top: 1rem;

        &--title {
          display: flex;
          justify-self: end;
        }

        &--date {
          display: flex;
          align-self: end;

        }

        &--date.text {
          width: 18rem;
        }

        &--date.date {
          align-self: center;
          justify-self: start;
          width: 11rem;
          color: black;
        }
      }

      &__search-bar {
        position: relative;
        width: 50%;
        background-color: $off-white;
        border-radius: 5px;
        opacity: .9f;
      }

      &__player-rankings {
        position: relative;
        width: 98%;
        height: 70vh;
        background-color: $off-white;
        opacity: 1;
        border-radius: 2.5rem;
        margin: 16px
      }
    }

    .right-column {
      &__image {
        position: relative;
        min-height: 27rem;
        width: 100%;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(RedPocketAces.png);
        background-repeat: no-repeat;
        background-size: cover;

      }
    }
  }

  @media screen and (max-width: 859px) {
    .container {

      .left-column {

        &__header {

          &--title {
            justify-self: center;
          }

          &--date {
            justify-self: center;
          }
        }

        &__search-bar {
          width: 40%;
        }

        &__player-rankings {
          width: 98%;
        }
      }

    }

  }

  @media screen and (max-width: 800px) {
    .container {
      width: 100%;
      grid-template-columns: 1fr;
      .left-column {
        &__header {
          width: 80%;
          margin: 1.6rem;
        }
        &__player-rankings {
          margin: 8px;
        }
      }
      .right-column {
        display: none;
      }
    }
  }

  @media screen and (max-width: 415px) {
    .container {
      width: 100%;
      grid-template-columns: 1fr;
      .left-column {
        width: 94%;
        margin-left: 8px;

        &__header {
          margin: 0;
          &--title {
            font-size: 1.8rem;
            margin-bottom: 0;
          }
          &--date {
            margin-left: 1.6rem;
            margin-bottom: 0;
          }
        }

        &__search-bar {
          width: 70%;
          margin-top: 0;
        }

        &__player-rankings {
          width: 98%;
        }
      }

    }

  }
</style>
