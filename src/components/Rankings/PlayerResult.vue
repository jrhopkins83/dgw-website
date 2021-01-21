<template>
  <div>
    <li
      class="item item-container player-table__items q-mt-xs">
      <div class="attribute rank">{{ player.finishedPosition }}</div>
      <div class="player-img q-px-sm q-py-xs">
        <q-avatar
          clickable
          ripple
          @click="selectPlayer"
        >
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
          <div class="attribute name">{{ player.firstName }} {{ player.lastName }}</div>
          <div class="attribute nick-name">{{ player.nickName}}</div>
          <div class="attribute online-name">{{ player.onlineName }}</div>
        </div>
      </div>
      <div class="attribute-container stats">
        <div class="attribute points">{{ player.points}}</div>
        <div class="attribute winnings">{{ winnings_formatted }}</div>
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
      if (this.player.avatar.avatarUrl) {
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

    .item-container {
        display: grid;
        grid-template-columns: 4em 5em 8fr 6fr;
    }

    .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
    }

    /* Definition of wrapping column width for attribute groups. */
    .player-information {
        --column-width-min: 7.2em;
    }

    .stats {
        --column-width-min: 4.2em;
    }

    .rank, .points , .winnings {
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

    .rank {
      font-weight: bold;
    }

    .points {
      font-weight: bold;
      color: $primary
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
