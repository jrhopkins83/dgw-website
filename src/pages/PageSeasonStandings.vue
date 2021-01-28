<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <div
        class="container"
        v-if="standingsLoaded && playersLoaded"
      >
        <div class="left-column">
          <div class="left-column__header text-white text-h3 q-ml-md">
            {{ pageTitle }}
          </div>
          <div class="left-column__search-bar q-pa-xs q-ma-md">
            <search>
            </search>
          </div>
          <div class="left-column__player-rankings">
            <player-rankings
              :standings="standingsFiltered"
              :pageHeight="pageHeight"
            >
            </player-rankings>
          </div>
        </div>
        <div class="right-column">
          <div class="right-column__image"></div>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'PageSeasonStandings',
  components: {
    playerRankings: require('components/Rankings/SeasonStandings.vue').default,
    search: require('components/Rankings/SearchStandings.vue').default
  },
  data () {
    return {
      pageHeight: '85rem'
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    ...mapGetters('games', ['gameDates', 'lastCompletedDate']),
    ...mapGetters('standings', ['standingsFiltered', 'standingsLoaded']),
    ...mapGetters('players', ['playersLoaded', 'playersFiltered']),
    txtLastDate: function () {
      let shortDate = ''
      const startDateTm = this.lastCompletedDate.toDate()
      if (this.$q.screen.width > 800) {
        shortDate = date.formatDate(startDateTm, 'ddd, MMM Do')
      } else {
        shortDate = date.formatDate(startDateTm, 'MM/DD/YY')
      }
      return shortDate
    },
    pageTitle: function () {
      return `Season Standings through ${this.txtLastDate}`
    }
  },
  methods: {
    ...mapActions('standings', ['setSearch'])
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
    align-items: center;
    justify-content: center;
    display: grid;
    grid-template-columns: 6.5fr 3.5fr;
    align-items: flex-start;
    overflow: hidden;

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
        text-align: center;
        gap: 2rem;
        margin-top: 1rem;
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
        justify-self: center;
        border-radius: 2.5rem;
        opacity: .9;
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

  @media screen and (max-width: 887px) {
    .container {
      width: 100%;
      .left-column {
        &__header {
          width: 80%;
          margin-left: 8rem;
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
          margin: 8px;
        }
        &__player-rankings {
          margin: 0%;
        }
      }
      .right-column {
        display: none;
      }
    }
  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;
      .left-column {
        &__header {
          width: 100%;
          font-size: 18px;
        }
        &__search-bar {
          width: 70%;
        }
      }
    }
  }
</style>
