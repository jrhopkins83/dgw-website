<template>
  <div class="collection collection-container schedule-section__games--items q-mb-sm">
    <li class="item item-container item-row q-mt-xs" >
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container game-date">
        <div class="attribute date">{{ date_short }}</div>
      </div>
      <div class="attribute-container game-structure">
        <div class="attribute buy-in">{{ buyIn_formatted }}</div>
        <div class="attribute type">{{ game.type }}</div>
        <div class="attribute structure">{{ game.structure}}</div>
      </div>
      <div class="attribute-container game-details">
        <div
          clickable
          @click="$emit('viewGameDetails', [game, id])"
          class="attribute details text-center cursor-pointer text-blue-9"
        >
          Details
        </div>
      </div>
    </li>
  </div>

</template>

<script>
import { date } from 'quasar'
import { currencyFormat } from 'src/functions/functions-common'

export default {
  name: 'Games',
  props: ['id', 'game'],
  data () {
    return {

    }
  },
  computed: {
    date_short: function () {
      // replace after getting data form FS
      const startDateTm = this.game.gameDate.toDate()
      const shortDate = date.formatDate(startDateTm, 'M/D/YY')
      return shortDate
    },
    buyIn_formatted () {
      return currencyFormat.format(this.game.buyIn)
    }

  },
  methods: {
    viewGameDetails () {

    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .schedule-section__games--table {

    li {
      list-style: none;
    }

    .item-row {
      min-height: 3rem;
      align-items:flex-start;
      justify-content: center;
      text-overflow: initial;
      white-space: normal;
      display: grid;
      grid-template-columns: 7.8rem 4fr 1fr;
      grid-column-gap: 1.6rem;

      .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

        /* Definition of wrapping column width for attribute groups. */
      }
      .attribute-container.game-structure {
          --column-width-min: 5.2em;
      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 291px) {
  .item-row {
    grid-column-gap: .5rem !important;

    .game-date {
      justify-self: center;
    }
  }
}

</style>
