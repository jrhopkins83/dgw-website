<template>
  <div class="games-section">
    <li class="item item-container games-section__games--items q-mt-xs">
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container game-information">
        <div class="attribute date">{{ date_short }}</div>
        <div class="attribute buy-in">{{game.buyIn }}</div>
        <div class="attribute type">{{ game.type }}</div>
      </div>
      <div class="attribute-container game-structure">
        <div class="attribute structure">{{ game.structure}}</div>
          <q-btn
            flat
            label="Details"
            text-color="blue-9"
            no-caps
            size="16px"
            @click="$emit('viewGameDetails', [game, id])"
            class="attribute details"
          >
          </q-btn>
      </div>
    </li>
  </div>

</template>

<script>
import { date } from 'quasar'

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
      const shortDate = date.formatDate(startDateTm, 'MM/DD/YY')
      return shortDate
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
  .games-section {

    li {
      list-style: none;
      border-bottom: solid $light-grey;
      margin-bottom: 8px;
    }

    .item-container {
      display: grid;
      grid-template-columns: 1fr 4fr;
      grid-gap: 1rem;

      .attribute-container.game-information {
        display: grid;
        grid-template-columns: 8rem 6rem 6rem;
        grid-gap: 1rem;

          .attribute.buy-in {
            display: flex;
            justify-content: center;
          }
      }

      .attribute-container.game-structure {
        display: grid;
        grid-template-columns: 26rem 5rem;
      }

      .attribute-container.game-buttons {
        display: grid;
        grid-template-columns: repeat(4, 4rem);
        grid-gap: 4px;
        // grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

    }
        .items {
            border-bottom: solid $light-grey;
            margin-bottom: 8px;
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

/* Tabular Layout */
@media screen and (min-width: 360px) {

}
</style>
