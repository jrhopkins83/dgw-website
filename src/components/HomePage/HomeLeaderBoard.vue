<template>
  <div>
    <template v-if="standingsLoaded">
      <section class="rankings-section">
        <div class="rankings-section__players q-mb-sm">
          <div class="row players-card">
            <div class="col-12 players-card__title text-center">
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

          <ol class="collection collection-container player-table q-mb-sm">
            <!-- The first list item is the header of the table -->
            <li class="item item-container player-table__heading-row">
              <div class="a ttribute">Rank</div>
              <div class="attribute">Player</div>
              <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class="attribute-container player-information">
                <div class="attribute-container player-names">
                  <div class="attribute"></div>
                  <div class="attribute gt-xs"></div>
                  <div class="attribute"></div>
                </div>
              </div>
              <div class="attribute-container points">
                <div class="attribute">Points</div>
              </div>
              <div class="attribute-container games gt-xs">
                <div class="attribute">Games</div>
              </div>
              <div class="attribute-container average gt-xs">
                <div class="attribute">Pts / Game</div>
              </div>
              <!-- <div class="attribute-container winnings">
                <div class="attribute">Winnings</div>
              </div> -->
            </li>
            <!-- The rest of the items in the list are the actual data -->
            <player-rank
              v-for="(player, playerID) in finalTableList"
              :key="playerID"
              :player="player"
              @select="viewPlayerDetails"
            >
            </player-rank>
          </ol>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'HomeLeaderBoard',
  components: {
    playerRank: require('components/Rankings/PlayerRanking.vue').default
  },
  props: ['standings'],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    ...mapGetters('standings', ['standingsLoaded']),
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

      this.standings.forEach(player => {
        if (player.position <= this.limit) {
          finalTableList.push(player)
        }
      })

      return finalTableList
    },
    txtLastDate: function () {
      return date.formatDate(this.lastCompletedDate.toDate(), 'dddd MMMM D')
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
  .rankings-section {
    position: relative;
    min-height: 95.5rem;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-image: url(the-main-event-bracelet-stretched.jpg);
    background-size: cover;

    ol.collection {
      position: relative;
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
    }

    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    &__players {
      background-color: $blue-6;
      min-height: 90%;
      max-width: 120rem;
      border-radius: 2rem;
      margin-top: 4rem;
      opacity: .8;

    .players-card {
      position: relative;
      width:100%;
      height: 95%;
      // background-color: $royal-blue;
      min-height: 90%;
      border-radius: 19px;
      opacity: 1;
      margin-bottom: 8px;

      &__title {
        color: $white;
      }

      &__actions {
        color: $white;
      }
    }

      &::before {
        content: "";
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-color: rgba(0,0,0,0.65);
      }

      .player-table {
        margin: 0 1.6rem 1.6rem 1.6rem;

        &__heading-row {
          color: $white;
          font-weight: bold;
          margin-bottom: 8px;
        }
      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .rankings-section {
    background-image: url(Wsop-Bracelet-Tall.jpg);
  }
  .online-name-header {
    display: none;
  }
}

/* Tabular Layout */
@media screen and (min-width: 360px) {
  .rankings-section {

    /* The maximum column width, that can wrap */
      .item-container {
          display: grid;
          grid-template-columns: 4em 5em 8fr 2fr 2fr 2fr;
      }

      .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 8.2em;
      }

  /* Center header labels */
  .collection-container > .item-container:first-child .attribute {
    display: flex;
    align-items:flex-end;
    justify-content: center;
    text-overflow: initial;
    overflow: auto;
    white-space: normal;
    font-weight: bold;
  }

  .rank, .points , .games, .average, .winnings {
    display: flex;
    align-items: center;
    justify-content: center;
    }
  }

}
</style>
