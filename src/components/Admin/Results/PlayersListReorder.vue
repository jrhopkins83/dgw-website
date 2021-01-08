<template>
  <div>
    <section class="players-list">
      <div class="players-list__players q-mb-sm" :class="type">
        <!-- <template v-if="!Object.keys(players).length">
          <div>
            <no-players
              :message='noPlayersMsg'
            >
            </no-players >
          </div>
        </template>
        <template v-else> -->
          <ol class="collection collection-container table-header q-mb-sm">
            <li class="item item-container table-header q-mt-xs"
              :class="type"
            >
              <div class="attribute position text-center"></div>
              <div class="attribute position text-center">Order</div>
              <div class="attribute player">Player</div>
              <div class="attribute-container player-information">
                <div class="attribute player-name"></div>
                <div class="attribute nick-name">Nickname</div>
                <div class="attribute online-name">Online Name</div>
              </div>
            </li>
          </ol>
          <draggable
            class="list-group collection collection-container players-list__players--table table-items q-mb-sm"
            tag="ol"
            v-model="playersList"
            v-bind="dragOptions"
            handle=".handle"
            @start="drag = true"
            @end="drag = false"
          >
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <li
                class="list-group-item item item-container items q-mt-xs"
                v-for='(player, index) in playersList'
                :key='player.playerID'
                :id='index'
              >
                  <div class="eliminate q-pl-sm q-pt-xs
                  ">
                    <q-icon
                      class="handle"
                      color="primary"
                      name="drag_handle"
                      size="md"
                    />
                  </div>
                  <div class="position q-pa-sm">
                    {{ player.finishedPosition}}
                  </div>
                  <div class="player-img q-px-xs q-py-none" v-if="player.avatar">
                    <q-avatar size="40px">
                      <img :src="player.avatar.avatarUrl" color="primary">
                    </q-avatar>
                  </div>
                  <div class="player-img q-px-xs q-py-none" v-else>
                    <q-avatar size="40px">
                      <img :src="default_avatar" color="primary">
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
            </transition-group>
          </draggable>
          <!-- </template> -->
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import { toTitleCase } from 'src/functions/functions-common'

export default {
  name: 'PlayerListReorder',
  components: {
    // player: require('src/components/Admin/Results/Player.vue').default,
    // noPlayers: require('components/Shared/NoPlayers.vue').default
    // Container,
    draggable
  },
  props: ['type'],
  data () {
    return {
      noPlayersMsg: 'No players remaining',
      playerSorted: false,
      // playersList: Object.values(this.players),
      drag: false
    }
  },
  computed: {
    ...mapGetters('tourneyResults', ['numFinished', 'numCheckedIn', 'finishedPlayers']),
    showType: function () {
      return toTitleCase(this.type)
    },
    default_avatar: function () {
      return 'default.jpg'
    },
    playersList: {
      get () {
        const finishedSorted = [],
          keysOrdered = Object.keys(this.finishedPlayers)

        keysOrdered.sort((a, b) => {
          const playerAProp = this.finishedPlayers[a].finishedPosition
          const playerBProp = this.finishedPlayers[b].finishedPosition

          if (playerAProp > playerBProp) return 1
          else if (playerAProp < playerBProp) return -1
          else return 0
        })

        let player = null
        keysOrdered.forEach((key) => {
          player = this.finishedPlayers[key]
          // player.id = key
          finishedSorted.push(player)
        })

        return finishedSorted
      },
      set (value) {
        // const payload = {
        //   players: value,
        //   numCheckedIn: this.numCheckedIn
        // }

        this.reorderFinishedPlayers(value)
      }
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    // finishedPlayers: function () {
    //   this.sort()
    // }
  },
  methods: {
    ...mapActions('tourneyResults', ['reorderFinishedPlayers', 'restorePlayer']),
    changePlayerStatus (payload) {
      if (this.type === 'checked-in') {
        this.knockoutPlayer(payload)
      } else {
        this.restorePlayer(payload)
      }
    },
    sort () {
      if (this.type === 'finished') {
        return this.playersList.sort((a, b) => a.finishedPosition - b.finishedPosition)
      }
    }
  },
  beforeMount () {
    // this.sort()
  }
}
</script>

<style lang="scss" scoped>
  .players-list {
    position: relative;
    width: 98%;
    background-color: $off-white;
    border-radius: 2.5rem;
    opacity: .85;
    margin: 16px;
    height: 66vh;
    overflow: hidden;

    ol.collection.table-header {
      margin: 0 1.6rem .4rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
    }

    ol.collection.table-items {
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
    }

    /* Center header labels */
    .collection-container > .item-container:first-child .attribute {
      font-weight: bold;
      display: flex;
      align-items:flex-end;
      justify-content: flex-start;
      text-overflow: initial;
      overflow: auto;
      white-space: normal;

      .position {
        justify-content: center;
      }
    }
    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    .checked-in {
      background-color: $blue-2;
    }

    .finished {
      background-color: $light-blue;
    }

    &__players {
      height: 66vh;
      width: 100%;
      overflow: auto;
      border-radius: 2.5rem;
      opacity: 0.8;

      .items {
        margin: 0 .6rem .6rem .6rem;
        position: relative;
        max-width: 120rem;
        border: solid;
        border-radius: 9px;
        margin-bottom: 4px;
        display: grid;
        grid-template-columns:  3em 4em 4em 6fr;

      .position, .eliminate {
        display: flex;
        align-items: center;
        justify-content: center;
      }

        .finished {
          background-color: $light-blue;
        }

      }

      .item-container.table-header {
        display: grid;
        grid-template-columns:  3.7em 3.8em 4em 6fr;
      }

      .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

        /* Definition of wrapping column width for attribute groups. */
        }
      .player-information {
          --column-width-min: 7.2em;

        .name, .nick-name, .online-name {
          display: flex;
          align-items: center;
        }

      }

    }
  }
// Draggable styling
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

  // Component styling
  .players-list {
    position: relative;
    width: 98%;
    background-color: $off-white;
    border-radius: 2.5rem;
    opacity: .85;
    margin: 16px;
    height: 66vh;
    overflow: hidden;

    ol.collection {
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
    }

    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    .checked-in {
      background-color: $blue-2;
    }

    .finished {
      background-color: $light-blue;
    }

    &__players {
      height: 66vh;
      width: 100%;
      overflow: auto;
      border-radius: 2.5rem;
      opacity: 0.8;

      .no-players {
        max-width: 90vw;
        font-size: 2.4rem;

      }
      &--table {
        margin: 0 .6rem .6rem .6rem;
        position: relative;
        max-width: 120rem;

        .checked-in {
          background-color: $blue-2;
        }

        .finished {
          background-color: $light-blue;
        }

        .player-table__heading-row {
          position: sticky;
          top: 0;
          color:  black;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
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
