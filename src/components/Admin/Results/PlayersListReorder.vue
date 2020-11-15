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
        <template v-else>
          <ol class="collection collection-container players-list__players--table q-mb-sm">
            <li class="item item-container player-table__items q-mt-xs"
              :class="type"
            >
              <div class="attribute position text-center">{{ showType }}</div>
              <div class="attribute">Player</div>
              <div class="attribute-container player-information">
                <div class="attribute last-name"></div>
                <div class="attribute nick-name">Nickname</div>
                <div class="attribute online-name">Online Name</div>
              </div>
            </li> -->
          <draggable
              class="list-group collection collection-container players-list__players--table q-mb-sm"
              tag="ol"
              v-model="playerList"
              v-bind="dragOptions"
              handle=".handle"
              @start="drag = true"
              @end="drag = false"
            >
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <li class="list-group-item item item-container player-table__items q-mt-xs"
                :class="type"
                v-for='(player, index) in players'
                :key='player.playerID'
                :id='index'
                :player='player'
                :type='type'
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
                <div class="player-img q-px-xs q-py-none" v-if="player.avatar">
                  <q-avatar size="40px">
                    <img :src="player.avatar" color="primary">
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
  components: {
    // noPlayers: require('components/Shared/NoPlayers.vue').default
    draggable
  },
  props: ['players', 'type'],
  data () {
    return {
      noPlayersMsg: 'No players have been knocked out',
      playerSorted: false,
      playerList: this.players,
      drag: false
    }
  },
  computed: {
    ...mapGetters('tourneyResults', ['numFinished', 'numCheckedIn']),
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    showType: function () {
      return toTitleCase(this.type)
    }
  },
  watch: {
    finishedPlayers: function () {
      this.sort()
    }
  },
  methods: {
    ...mapActions('tourneyResults', ['knockoutPlayer', 'restorePlayer']),
    sort () {
      if (this.type === 'finished') {
        return this.players.sort((a, b) => a.finishedPosition - b.finishedPosition)
      }
    }
  },
  beforeMount () {
    this.sort()
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
      overflow: scroll;
      border-radius: 2.5rem;
      opacity: 0.8;

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
          display: flex;
          position: sticky;
          top: 0;
          color:  black;
          align-items:flex-end;
          justify-content: flex-start;
          text-overflow: initial;
          white-space: normal;
          margin-top: 1rem;
          overflow: auto;
          font-weight: bold;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          white-space: normal;
        }
      }

      .item-container.checked-in {
        display: grid;
        grid-template-columns: 6em 4em 8fr 4em;
      }

      .item-container.finished {
        display: grid;
        grid-template-columns:  6em 4em 4em 8fr;
      }

      .attribute-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

        /* Definition of wrapping column width for attribute groups. */
        .player-information {
            --column-width-min: 7.2em;

          .name, .nick-name, .online-name {
            display: flex;
            align-items: center;
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
