<template>
  <div>
    <li
      class="item item-container player-table__items q-mt-xs">
      <div class="attribute rank">{{ player.position }}</div>
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
        <div class="attribute">{{ player.totalPoints}}</div>
      </div>
      <div class="attribute-container games gt-xs">
        <div class="attribute">{{ player.games }}</div>
      </div>
      <div class="attribute-container average gt-xs">
        <div class="attribute">{{ player.pts_game }}</div>
      </div>
      <!-- <div class="attribute-container winnings">
        <div class="attribute">{{ player.winnings }}</div>
      </div> -->
    </li>
  </div>

</template>

<script>

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  currency: 'USD'

})

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
      return formatter.format(this.player.winnings)
    },
    screenWidth () {
      return this.$q.screen.width
    },
    player_avatar: function () {
      if (this.player.avatar) {
        return this.player.avatar
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
          background-color: $light-blue;
          border-radius: 9px;
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

    .player-names {

      .name, .nick-name, .online-name {
        display: flex;
        align-items: center;
      }
    }
  }

}
</style>
