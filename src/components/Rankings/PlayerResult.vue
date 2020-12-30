<template>
  <div>
    <li
      class="item item-container player-table__items q-mt-xs">
      <div class="attribute rank">{{ player.finishedPosition }}</div>
      <div class="player-img q-px-sm q-py-xs">
        <q-avatar>
          <img :src="player_avatar" color="primary">
        </q-avatar>
      </div>
      <!-- Enclose semantically similar attributes as a div hierarchy -->
      <div class="attribute-container player-information"
        clickable
        ripple
        @click="selectPlayer"
      >
        <div class="attribute-container player-names">
          <div class="attribute name">{{ player.firstName }}</div>
          <div class="attribute nick-name">{{ player.nickName}}</div>
          <div class="attribute online-name">{{ player.onlineName }}</div>
        </div>
      </div>
      <div class="attribute-container points">
        <div class="attribute">{{ player.points}}</div>
      </div>
      <div class="attribute-container gt-xs winnings">
        <div class="attribute">{{ winnings_formatted }}</div>
      </div>
    </li>
  </div>

</template>

<script>
import { currencyFormat } from 'src/functions/functions-common'

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
      return currencyFormat.format(this.player.prizeMoney)
    },
    screenWidth () {
      return this.$q.screen.width
    },
    player_avatar: function () {
      if (this.player.avatar) {
        return this.player.avatar.avatarUrl
      } else {
        return 'default.jpg'
      }
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
  .rankings-section {

    li {
      list-style: none;
    }

    &__players {

      .player-table {

        &__items {
          border-bottom-style: groove;
          border-bottom-color: $grey-2;
          margin-bottom: 8px;

          .rank {
            font-weight: bold;
          }

          .points {
            font-weight: bold;
            color: $primary
          }

        }

        /* The maximum column width, that can wrap */
          .item-container {
              display: grid;
              grid-template-columns: 4em 5em 8fr 2fr 2fr;
          }

          .attribute-container {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
          }

          /* Definition of wrapping column width for attribute groups. */
          .player-information {
              --column-width-min: 8.2em;
          }

          .rank, .points , .games, .average, .winnings {
            display: flex;
            align-items: center;
            justify-content: center;
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

/* Tabular Layout */
@media screen and (min-width: 360px) {
  .rankings-section {

    .rank, .points , .games, .average, .winnings {
      display: flex;
      align-items: center;
      justify-content: center;
      }

    .player-names {

      .name, .nick-name, .online-name {
        display: flex;
        align-items: center;
      }
    }
  }

}
</style>
