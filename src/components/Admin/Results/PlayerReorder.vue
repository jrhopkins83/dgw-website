<template>
  <div>
    <li class="list-group-item item item-container player-table__items q-mt-xs"
      :class="type"
    >
      <div class="eliminate">
        <q-icon
          class="handle"
          color="primary"
          name="drag_handle"
          size="md"
        />
      </div>
      <div class="position">
        {{ player.finishedPosition}}
      </div>
      <div class="player-img q-px-xs q-py-none">
        <q-avatar size="40px">
          <img :src="player_avatar" color="primary">
        </q-avatar>
      </div>
      <div class="attribute-container player-information">
        <div class="attribute-container player-names">
          <div class="attribute name">{{ player.firstName }}</div>
          <div class="attribute nick-name">{{ player.nickName}}</div>
          <div class="attribute online-name">{{ player.onlineName }}</div>
        </div>
      </div>
    </li>
  </div>

</template>

<script>
import { showMessage } from 'src/functions/functions-common'
import { mapActions } from 'vuex'

export default {
  name: 'Player',
  props: ['id', 'player', 'type'],
  data () {
    return {
      model: null,
      checkedIn: this.player.checkedIn
    }
  },
  computed: {
    player_avatar: function () {
      if (this.player.avatar) {
        return this.player.avatar.avatarUrl
      } else {
        return 'default.jpg'
      }
    }
  },
  methods: {
    ...mapActions('tourneyResults', ['updateCheckedInPlayer']),
    updateCheckedIn () {
      const newResult = {
        docID: this.player.id,
        checkedIn: this.checkedIn
      }
      this.updateCheckedInPlayer(newResult)
    },
    selectPlayer () {
      if (this.player.checkedIn) {
        const playerToChange = {
          id: this.id,
          docID: this.player.id,
          player: this.player
        }
        this.$emit('selectPlayer', playerToChange)
      } else {
        const message = `${this.player.firstName} isn't checked in. Click Checked In first.`
        showMessage(message)
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang='scss' scoped>
  .players-list {

    li {
      list-style: none;
    }

    &__players {

      .player-table {

        &__items {
          border: solid;
          border-radius: 9px;
          margin-bottom: 4px;

          .position {
            font-weight: bold;
          }

          .points {
            font-weight: bold;
            color: $primary
          }

          .eliminate {
            button {
              font-weight: bold;
              font-size: 16px;
            }
          }
        }

      }
    }
  }

  .checked-in {
    background-color: $light-blue;
  }

  .finished {
    background-color: $blue-2;
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
  .players-list__players {
    /* The maximum column width, that can wrap */
    .item-container.checked-in {
      display: grid;
      grid-template-columns: 6em 3.5em 8fr 4em;
    }
  }
  .players-list__players {
    /* The maximum column width, that can wrap */
    .item-container.finished {
      display: grid;
      grid-template-columns: 6em 4em 4em 8fr;
    }
  }
  .players-list__players {

    .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
    }

    /* Definition of wrapping column width for attribute groups. */
    .player-information {
        --column-width-min: 7.2em;
    }

    /* Center header labels */
    .collection-container > .item-container:first-child .attribute {
      display: flex;
      align-items:flex-end;
      justify-content: flex-start;
      text-overflow: initial;
      overflow: auto;
      white-space: normal;
      font-weight: bold;
    }

    .position, .eliminate {
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
