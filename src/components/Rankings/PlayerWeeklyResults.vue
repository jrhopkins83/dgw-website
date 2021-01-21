<template>
  <div>
    <section class='results-section'>
      <div class='results-section__players q-mb-sm'>
        <ol class='collection collection-container player-table q-mb-sm'>
          <!-- The first list item is the header of the table -->
          <li class='item item-container player-table__heading-row'>
            <div class='attribute-container date'>
              <div class='attribute date q-ml-sm'>Date</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>Place</div>
              <div class='attribute points'>Points</div>
              <div class='attribute winnings'>$ Won</div>
            </div>
          </li>
          <player-result
            v-for='(player, playerID) in playerResults'
            :key='playerID'
            :player='player'
          >
          </player-result>

        </ol>
        <ol class="collection collection-container text-bold">
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-md'>Totals</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'></div>
              <div class='attribute points'>{{ playerTotals.totalPoints }}</div>
              <div class='attribute winnings'>{{ winnings_formatted }}</div>
            </div>
          </li>
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-xs'>1st Place</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>{{ playerTotals.total1st }}</div>
              <div class='attribute points'></div>
              <div class='attribute winnings'></div>
            </div>
          </li>
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-xs'>2nd Place</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>{{ playerTotals.total2nd }}</div>
              <div class='attribute points'></div>
              <div class='attribute winnings'></div>
            </div>
          </li>
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-xs'>3rd Place</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>{{ playerTotals.total3rd }}</div>
              <div class='attribute points'></div>
              <div class='attribute winnings'></div>
            </div>
          </li>
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-xs'>4th Place</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>{{ playerTotals.total4th }}</div>
              <div class='attribute points'></div>
              <div class='attribute winnings'></div>
            </div>
          </li>
          <li class='item item-container player-table__totals-row'>
            <div class='attribute-container totals'>
              <div class='attribute totals-row q-ml-sm q-mb-xs'>Final Tables</div>
            </div>
            <div class='attribute-container player-information'>
              <div class='attribute place'>{{ playerTotals.finalTables }}</div>
              <div class='attribute points'></div>
              <div class='attribute winnings'></div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
import { currencyFormat } from 'src/functions/functions-common'

export default {
  name: 'PlayerResults',
  components: {
    playerResult: require('components/Rankings/PlayerWeeklyResult.vue').default
  },
  props: [
    'playerResults',
    'playerTotals'
  ],
  data () {
    return {

    }
  },
  computed: {
    winnings_formatted () {
      if (!isNaN(this.playerTotals.winnings)) {
        return currencyFormat.format(this.playerTotals.winnings)
      } else {
        return '$0'
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
  .results-section {
    height: 74vh;
    border: inset white 1px;
    border-radius: 5%;
    margin-top: 1rem;
    overflow: hidden;

    ol.collection {
      margin: 0 1.6rem .5rem 1.6rem;
      padding: 0px;
    }

    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    /* The maximum column width, that can wrap */
      .item-container {
          display: grid;
          grid-template-columns: 12rem 1fr;
      }

      .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 4.2em;
      }

    .collection-container > .item-container:first-child .player-names .attribute {
      justify-content: flex-start;
    }

    .place, .points , .winnings {
      display: flex;
      align-items: center;
      justify-content: center;
      }

    &__players {
      // background-color:$off-white;
      height: 74vh;
      max-width: 64rem;
      overflow: hidden;
      border-radius: 2.5rem;
      opacity: 1;

      .player-table {
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;
        max-width: 64rem;
        max-height: 40rem;
        overflow: auto;

        &__heading-row {
          position: sticky;
          z-index: 1;
          top: 0;
          color: black;
          background-color: $off-white;
          opacity: 1;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          text-decoration: underline;
        }

      }
    }
  }

  .q-page {
    min-height: auto;
  }

  @media screen and (max-width: 600px) {
    .online-name-header {
      display: none;
    }
  }

</style>
