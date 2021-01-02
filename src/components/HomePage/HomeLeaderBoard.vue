<template>
  <div>
    <div class="column container">
      <div class="col header">
        <div class="col-12 header__title text-center">
          <div class="col-12 text-h4 text-weight-bold q-mt-sm q-pt-none q-pb-xs">
            Final Table Standings
          </div>
          <div class="col-12 text-subtitle1 text-weight-bold q-pt-none q-pb-xs">
            (Top {{ limit }} qualify)
          </div>
          <div class="col-12 text-body1 text-weight-bold q-pt-none q-pb-xs">
            through {{ txtLastDate }}
          </div>
        </div>
      </div>
      <div class="column ranking-section">
        <div class="ranking-section__player-rankings">
          <player-rankings
            :standings="finalTableList"
          >
          </player-rankings>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'HomeLeaderBoard',
  components: {
    playerRankings: require('components/Rankings/SeasonStandings.vue').default
  },
  props: ['standings'],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    ...mapGetters('games', ['lastCompletedDate']),
    updating () {
      const stillLoading = !this.standingsLoaded // TO-DO: add other loading events
      return stillLoading
    },
    limit () {
      return this.leagueInfo.finalTablePlayers
    },
    finalTableList () {
      const finalTableList = []

      if (this.standings) {
        this.standings.forEach(player => {
          if (player.position <= this.limit) {
            finalTableList.push(player)
          }
        })
      }

      return finalTableList
    },
    txtLastDate: function () {
      return date.formatDate(this.lastCompletedDate.toDate(), 'dddd MMMM D, YYYY')
    }
  },
  methods: {
    viewPlayerDetails (id) {
      console.log(`Player id ${id} selected`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    color: black;
    height: 83rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(the-main-event-bracelet-stretched.jpg);
    background-size: cover;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 7rem 1fr;
    align-items: flex-start;
    // overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color:rgba(0,0,0,0.65)
    }

    .header {
      position: relative;
      align-items: center;
      gap: 2rem;
      color: white;
      margin-top: 1rem;

      &--title {
        justify-self: end;
      }

      &--date {
        align-self: end;
      }
    }

    .ranking-section {
      width: 100%;
      max-width: 92rem;
      position: relative;
      justify-self: center;

      &__player-rankings {
        position: relative;
        width: 98%;
        border-radius: 2.5rem;
        opacity: .9;
        margin: 16px
      }
    }

  }

  @media screen and (max-width: 859px) {
    .container {

      .ranking-section {

        &__header {

          &--title {
            justify-self: center;
          }

          &--date {
            justify-self: center;
          }
        }

      }

    }

  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

      .ranking-section {
        width: 93%;

        &__player-rankings {
          width: 98%;
        }
      }

    }

  }
@media screen and (max-width: 600px) {
  .rankings-section {
    background-image: url(Wsop-Bracelet-Tall.jpg);
  }
  .online-name-header {
    display: none;
  }
}

</style>
