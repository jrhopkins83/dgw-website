<template>
  <div class="collection collection-container schedule-section__games--items q-mb-sm">
    <li class="item item-container item-row q-mt-xs" :class="isAdmin">
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container game-date">
        <div class="attribute date">{{ date_short }}</div>
      </div>
      <div class="attribute-container game-structure">
        <div class="attribute buy-in">{{ buyIn_formatted }}</div>
        <div class="attribute type">{{ game.type }}</div>
        <div class="attribute structure">{{ game.structure}}</div>
      </div>
      <div class="attribute-container game-details" :class="isAdmin">
        <div
          clickable
          @click="$emit('viewGameDetails', [game, id])"
          class="attribute details text-center cursor-pointer text-blue-9"
        >
          Details
        </div>
      </div>
      <div class="attribute-container game-buttons" v-if="adminButtons" >
        <div class="attribute edit">
          <q-btn
            icon="edit"
            flat
            size="md"
            @click="$emit('editGame', [game, id])"
          />
        </div>
        <div class="attribute delete">
          <q-btn
            icon="delete"
            flat
            size="md"
            @click="$emit('deleteGame', [game, id])"
          />
        </div>
        <!-- <div class="attribute invite" v-if="showButton">
          <q-btn
            icon="forward_to_inbox"
            flat
            size="md"
            @click="$emit('sendInvite', $event)"
          />
        </div> -->
        <div class="attribute complete" v-if="showButton">
          <q-btn
            icon="flag"
            flat
            size="md"
            @click="$emit('enterResults', id)"
          />
        </div>
        <div class="attribute complete" v-else>
          <q-btn
            disable
            icon="flag"
            flat
            color="grey-1"
            size="md"
          />
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
  props: [
    'id',
    'game',
    'isAdmin',
    'adminButtons'
  ],
  data () {
    return {

    }
  },
  computed: {
    date_short: function () {
      let shortDate = ''
      const startDateTm = this.game.gameDate.toDate()
      if (this.$q.screen.width > 800) {
        shortDate = date.formatDate(startDateTm, 'ddd, MMM Do')
      } else {
        shortDate = date.formatDate(startDateTm, 'MM/DD/YY')
      }
      return shortDate
    },
    buyIn_formatted () {
      return currencyFormat.format(this.game.buyIn)
    },
    showButton: function () {
      if (this.game.type === 'MTT' && !this.game.complete) {
        return true
      } else {
        return false
      }
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
      border-top: solid $light-grey;
      margin-bottom: 8px;
      align-items:flex-start;
      justify-content: center;
      text-overflow: initial;
      white-space: normal;
      display: grid;
      grid-template-columns: 12rem 4fr 1fr;
      grid-column-gap: 1.6rem;

      .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

      }
      .attribute-container.game-structure {
        --column-width-min: 5.2em;

        .buy-in {
          justify-self: center;
        }

      }
      .attribute-container.game-buttons {
        grid-template-columns: repeat(3, 1fr);
        justify-self: center;
      }
    }
    .item-container.isAdmin {
      grid-template-columns: 12rem 3.5fr .5fr 1fr;
    }

    .item-container.isNotAdmin {
      grid-template-columns: 12rem 4fr 1fr;
    }

  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 800px) {
  .item-row.isAdmin {
    grid-template-columns:  7.8rem 3.5fr 1fr 2fr !important;
  }

  .item-row.isNotAdmin {
    grid-template-columns:  7.8rem 4fr 1fr !important;
  }
}

@media screen and (max-width: 534px) {
  .attribute.buy-in {
    justify-self: flex-start !important;
  }
}

@media screen and (max-width: 401px) {
  .heading-row {
    height: 7.5rem !important;
  }
}
</style>
