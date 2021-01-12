<template>
  <div>
    <q-item-section avatar>
      <q-icon color="primary" name="drag_handle" class="handle"/>
    </q-item-section>
    <q-item-section>
      {{ index + 1 }}
    </q-item-section>
    <q-item-section>
      {{ player.firstName }}
    </q-item-section>
    <q-item-section>
      {{ player.lastName }}
    </q-item-section>
    <q-item-section>
      {{ player.nickName }}
    </q-item-section>
    <q-item-section>
      {{ player.onlineName }}
    </q-item-section>
    <q-item-section>
      {{ player.points }}
    </q-item-section>
  </div>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Player',
  props: ['index', 'player', 'type', 'key'],
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
    ...mapActions('tourneyResults', ['changePlayerCheckin'])
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
      grid-template-columns: 4em 6em 3.5em 8fr 4em;
    }
  }
  .players-list__players {
    /* The maximum column width, that can wrap */
    .item-container.finished {
      display: grid;
      grid-template-columns: 4em 6em 3.5em 8fr;
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
