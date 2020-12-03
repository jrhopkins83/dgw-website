<template>
  <div>
    <section class="players-list">
      <div class="players-list__players q-mb-sm" :class="type">
        <template v-if="!Object.keys(players).length">
          <div>
            <no-players
              :message='noPlayersMsg'
            >
            </no-players >
          </div>
        </template>
        <template v-else>
          <ol class="collection collection-container players-list__players--table q-mb-sm">
            <!-- The first list item is the header of the table -->
            <li class="item item-container player-table__heading-row q-mt-xs"
              :class="type"
            >
              <div
                clickable
                @click="setSortColumn('checkedIn')"
                class="attribute position text-center cursor-pointer"
              >
                {{ showType }}
                <q-tooltip>
                  Finalize the order and enter payouts.
                </q-tooltip>
              </div>
              <div class="attribute cursor-pointer"
                clickable
                @click="setSortColumn('name')"
              >
                Player
              </div>
              <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class="attribute-container player-information">
                <div class="attribute last-name"></div>
                <div class="attribute nick-name">Nickname</div>
                <div class="attribute online-name">Online Name</div>
              </div>
              <div class="attribute position text-center" v-if="type==='checked-in'">KO</div>
            </li>
            <player
              v-for='(player, index) in playersSorted'
              :key='index'
              :id='player.id'
              :player='player'
              :type='type'
              @koPlayer="changePlayerStatus"
            >
            </player>
        </ol>
        </template>
      </div>

      <div class="absolute-bottom text-center q-mb-lg no-pointer-events" v-if="type==='checked-in'">
        <q-btn
          @click="showAddPlayer = true"
          round
          class="all-pointer-events"
          color="blue-5"
          size="20px"
          icon="add"
        />
      </div>
      <q-dialog v-model="showAddPlayer">
        <add-player
          :player="null"
          @save="savePlayer"
          @close="showAddPlayer=false"
        />
      </q-dialog>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { firebaseStore } from 'src/boot/firebase'
import { toTitleCase } from 'src/functions/functions-common'

export default {
  components: {
    player: require('src/components/Admin/Results/Player.vue').default,
    noPlayers: require('components/Shared/NoPlayers.vue').default,
    addPlayer: require('components/Players/Modals/AddPlayer.vue').default
  },
  props: ['players', 'type'],
  data () {
    return {
      showAddPlayer: false,
      playerSorted: false
    }
  },
  computed: {
    ...mapGetters('tourneyResults', ['numFinished', 'numCheckedIn', 'finishedLoaded', 'finishedPlayers']),
    noPlayersMsg: function () {
      if (this.type === 'finished') {
        return 'No players have been knocked out'
      } else {
        return 'Everyone has been knocked out'
      }
    },
    showType: function () {
      return toTitleCase(this.type)
    },
    playersSorted: function () {
      if (this.type === 'finished') {
        const finishedSorted = [],
          keysOrdered = Object.keys(this.players)

        keysOrdered.sort((a, b) => {
          const playerAProp = this.players[a].finishedPosition
          const playerBProp = this.players[b].finishedPosition

          if (playerAProp > playerBProp) return 1
          else if (playerAProp < playerBProp) return -1
          else return 0
        })

        let player = null
        keysOrdered.forEach((key) => {
          player = this.players[key]
          // player.id = key
          finishedSorted.push(player)
        })

        return finishedSorted
      } else {
        return this.players
      }
    }
  },
  watch: {
    finishedPlayers: function () {
      this.sort()
    }
  },
  methods: {
    ...mapActions('tourneyResults', ['knockoutPlayer', 'restorePlayer', 'setSort']),
    changePlayerStatus (payload) {
      if (this.type === 'checked-in') {
        this.knockoutPlayer(payload)
      } else {
        this.restorePlayer(payload)
      }
    },
    setSortColumn (property) {
      if (this.type === 'checked-in') {
        this.setSort(property)
      }
    },
    async savePlayer (newPlayer) {
      this.setResultsLoaded(false)
      this.setFinishedLoaded(false)
      this.$q.loading.show({
        message: '<b>Adding New Players</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      const newPlayerNames = {
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        nickName: newPlayer.nickName,
        onlineName: newPlayer.onlineName,
        avatar: null
      }
      const newPlayerID = await this.addNewPlayer(newPlayerNames)
      if (newPlayerID) {
        if (newPlayer.email) {
          const newUserID = await this.createNewUser(newPlayer.email, 'dgwpassword')
          if (newUserID) {
            const playerContactInfo = {
              playerID: newPlayerID,
              email: newPlayer.email,
              phoneNumber: newPlayer.phoneNumber,
              userID: newUserID
            }
            await this.createUserPlayerRef(playerContactInfo)
          }
        }
        const newPlayerResult = {
          date: this.tournamentInfo.date,
          eventID: this.tournamentInfo.id,
          playerID: newPlayerID,
          firstName: newPlayerNames.firstName,
          lastName: newPlayerNames.lastName,
          nickName: newPlayerNames.nickName,
          onlineName: newPlayerNames.onlineName,
          avatar: null,
          RSVPd: false,
          checkedIn: true,
          finished: false,
          finishedPosition: 0
        }
        const resultsRef = firebaseStore.collection('tournamentResults')
        const resultDoc = await resultsRef.add(newPlayerResult)
        if (resultDoc.id) {
          this.resortFinishedPlayers(true)
          this.showAddPlayer = false
        } else {
          return false
        }
        this.setResultsLoaded(true)
        this.setFinishedLoaded(true)
        this.$q.loading.hide()
      }
    },
    sort () {
      if (this.type === 'finished') {
        const finishedSorted = [],
          keysOrdered = Object.keys(this.players)

        keysOrdered.sort((a, b) => {
          const playerAProp = this.players[a].finishedPosition
          const playerBProp = this.players[b].finishedPosition

          if (playerAProp > playerBProp) return 1
          else if (playerAProp < playerBProp) return -1
          else return 0
        })

        let player = null
        keysOrdered.forEach((key) => {
          player = this.players[key]
          // player.id = key
          finishedSorted.push(player)
        })

        return finishedSorted
      }
    }
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
          z-index: 1;
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

/* Tabular Layout */
@media screen and (min-width: 360px) {
  .players-list__players {
    /* The maximum column width, that can wrap */
    .item-container.checked-in {
      display: grid;
      grid-template-columns: 6em 4em 8fr 4em;
    }
  }
  .players-list__players {
    /* The maximum column width, that can wrap */
    .item-container.finished {
      display: grid;
      grid-template-columns: 6em 3.5em 8fr;
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
