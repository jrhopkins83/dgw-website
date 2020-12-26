<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      v-if="standingsLoaded && playersLoaded"
    >
      <div class="left-column">
        <div class="left-column__header text-white">
          <div class="left-column__header--title text-h3">
            Season Standings
          </div>
          <div class="left-column__header--date text-h3">
            through {{ txtLastDate }}
          </div>
        </div>
        <div class="left-column__search-bar q-pa-xs q-ma-md">
          <search>
          </search>
        </div>
        <div class="left-column__player-rankings">
          <player-rankings
            :standings="standingsFiltered"
          >
          </player-rankings>
        </div>
      </div>
      <div class="right-column">
        <div class="right-column__image"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'PageSeasonStandings',
  components: {
    playerRankings: require('components/Rankings/SeasonStandings.vue').default,
    search: require('components/Rankings/SearchStandings.vue').default
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    ...mapGetters('games', ['lastCompletedDate']),
    ...mapGetters('standings', ['standingsFiltered', 'standingsLoaded', 'setSearch']),
    ...mapGetters('players', ['playersLoaded', 'playersFiltered']),
    txtLastDate: function () {
      return date.formatDate(this.lastCompletedDate.toDate(), 'dddd MMMM D')
    },
    standingsList () {
      const players = Object.values(this.playersFiltered)
      const standings = this.standingsFiltered

      if (this.standingsLoaded && players.length && standings.length) {
        console.log(players)
        console.log(standings)
        const standingsMerged = standings.map(player => ({
          ...players.find((player) => (player.id === standings.id) && player),
          ...player
        }))
        return standingsMerged
      } else {
        return players
      }
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
    grid-template-columns: 6.5fr 3.5fr;
    align-items: flex-start;
    // overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent linear-gradient(307deg, #060607 0%, #28AD41 43%, #1E1F20 100%) 0% 0% no-repeat padding-box;;
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
          justify-self: end;
        }

        &--date {
          align-self: end;
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
        border-radius: 2.5rem;
        opacity: .9;
        margin: 16px
      }
    }

    .right-column {
      &__image {
        position: relative;
        min-height: 45rem;
        width: 100%;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(poker_table2_blurred.png);
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
          width: 70%;
        }

        &__player-rankings {
          width: 98%;
        }
      }

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
