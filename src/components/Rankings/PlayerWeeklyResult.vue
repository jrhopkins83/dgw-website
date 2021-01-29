<template>
  <div>
    <li class="item item-container player-table__items q-mt-sm">
      <div class='attribute-container date'>
        <div class='attribute date q-ml-sm'>{{ formattedDate }}</div>
      </div>
      <div class='attribute-container player-information'>
        <div class='attribute place'>{{ player.finishedPosition }}</div>
        <div class='attribute points'>{{ player.points }}</div>
        <div class='attribute winnings'>{{ winnings_formatted }}</div>
      </div>
    </li>
  </div>

</template>

<script>
import { currencyFormat } from 'src/functions/functions-common'
import { date } from 'quasar'

export default {
  name: 'PlayerRank',
  props: {
    player: Object
  },
  data () {
    return {

    }
  },
  computed: {
    winnings_formatted () {
      if (!isNaN(this.player.prizeMoney)) {
        return currencyFormat.format(this.player.prizeMoney)
      } else {
        return '$0'
      }
    },
    screenWidth () {
      return this.$q.screen.width
    },
    formattedDate: function () {
      return date.formatDate(this.player.gameDate.toDate(), 'ddd, MMMM D')
    }
  },
  methods: {
    selectPlayer () {
      this.$emit('select', this.player.playerID)
    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .results-section {
    // min-width: 70rem;

    li {
      list-style: none;
    }

    /* The maximum column width, that can wrap */
      .item-container {
          display: grid;
          grid-template-columns: 14rem 1fr;
      }

      .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 4.2em;
      }

      .place, .points , .winnings {
        display: flex;
        align-items: center;
        justify-content: center;
      }

    .collection-container > .item-container:first-child .attribute {
      display: flex;
      align-items:flex-end;
      justify-content: center;
      text-overflow: initial;
      overflow: auto;
      white-space: normal;
      font-weight: bold;
    }

    .collection-container > .item-container:first-child .player-names .attribute {
      justify-content: flex-start;
    }

    .place, .points , .winnings {
      align-self: center;
      justify-content: center;
    }

    &__players {

      .player-table {

        &__items {
          min-height: 2.5rem;
          border-bottom-style: solid;
          border-bottom-width: 1px;
          border-bottom-color: $grey-2;
          margin: 1rem 0 1rem 0;

          .rank, .points {
            font-weight: bold;
          }

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
