<template>
  <div>
    <section class="schedule-section">
      <div class="schedule-section__games">
        <template v-if="!Object.keys(upcomingGames).length && !Object.keys(completedGames).length">
          <div class="q-ma-lg">
            <no-games
              :message='noGamesMsg'
            >
            </no-games >
          </div>
        </template>
        <template v-else>
          <ol class="collection collection-container schedule-section__games--table q-mb-sm">
            <!-- The first list item is the header of the table -->
            <li class="item item-container heading-row" :class="isAdmin">
              <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class="attribute-container game-date">
                <div class="attribute date">Date</div>
              </div>
              <div class="attribute-container game-structure">
                <div class="attribute buy-in">Buy In</div>
                <div class="attribute type">Type</div>
                <div class="attribute structure">Structure</div>
              </div>
              <div class="attribute-container game-details">
                <div class="attribute details" :class="isAdmin"></div>
              </div>
              <div class="attribute-container game-buttons text-center" v-if="adminButtons" >Actions
                <div class="attribute edit"></div>
                <div class="attribute delete"></div>
                <!-- <div class="attribute invite"></div> -->
                <div class="attribute complete"></div>
              </div>
            </li>

              <game-row
                v-for='(game, index) in upcomingGames'
                :key='index'
                :id='game.id'
                :game='game'
                :isAdmin="isAdmin"
                :adminButtons="adminButtons"
                @viewGameDetails="viewGame"
                @editGame="editGame"
                @deleteGame="confirmDelete"
                @sendInvite="sendInvite"
                @enterResults="enterResults"
              >
              </game-row>
              <game-row
                v-for='(game, index) in completedGames'
                :key='index'
                :id='game.id'
                :game='game'
                :isAdmin="isAdmin"
                :adminButtons="adminButtons"
                @viewGameDetails="viewGame"
                @edit="editGame"
                @delete="deleteGame"
              >
              </game-row>
          </ol>
        </template>
      </div>
    </section>
    <div class="absolute-bottom text-center q-mb-lg no-pointer-events" v-if="adminButtons">
      <q-btn
        @click="addGame"
        round
        class="all-pointer-events"
        color="grey-7"
        size="20px"
        icon="add"
      />
    </div>
    <q-dialog
      v-model="showViewGame"
    >
      <view-game-details
        :game="game"
        :id="id"
        @close="showViewGame=false"
      />
    </q-dialog>
    <q-dialog
      v-model="showEditGame"
    >
      <edit-game-details
        :game="game"
        :id="id"
        :mode="mode"
        @save="saveGame"
        @close="closeGame"
      />
    </q-dialog>
    <q-dialog
      v-model="showViewGame"
    >
      <view-game-details
        :game="game"
        :id="id"
        @close="closeGame"
      />
    </q-dialog>
    <q-dialog
      v-model="confirm"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h3">
            {{ dialogHeader}}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ dialogMsg }}
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="deleteGame"
            color="blue-10"
            label="Confirm"
          />
          <q-btn
            v-close-popup
            color="negative"
            label="Cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { firebaseStore, Timestamp } from 'src/boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export default {
  components: {
    gameRow: require('src/components/Schedule/Game.vue').default,
    editGameDetails: require('src/components/Modals/ModalEditGameDetails.vue').default,
    viewGameDetails: require('src/components/Modals/ModalViewGameDetails.vue').default,
    noGames: require('components/Shared/NoGames.vue').default
  },
  props: [
    'upcomingGames',
    'completedGames',
    'isAdmin',
    'adminButtons'
  ],
  data () {
    return {
      gameSorted: false,
      showEditGame: false,
      showViewGame: false,
      mode: '',
      confirm: false,
      dialogHeader: '',
      dialogMsg: '',
      game: {},
      id: ''
    }
  },
  computed: {
    noGamesMsg: function () {
      return 'No games with that criteria'
    }
  },
  methods: {
    ...mapActions('games', ['setGamesLoaded']),
    ...mapActions('tourneyResults', ['setTournamentID']),
    addGame () {
      this.game = {}
      this.id = ''
      this.mode = 'add'
      this.showEditGame = true
    },
    editGame (value) {
      this.mode = 'edit'
      this.game = value[0]
      this.id = value[1]
      this.showEditGame = true
    },
    closeGame () {
      this.game = {}
      this.id = ''
      this.showEditGame = false
      this.showViewGame = false
    },
    viewGame (value) {
      this.game = value[0]
      this.id = value[1]
      this.showViewGame = true
    },
    confirmDelete (value) {
      this.game = value[0]
      this.id = value[1]
      this.dialogHeader = 'Confirm Delete?'
      this.dialogMsg = 'Are you sure you want to delete this game?'
      this.confirm = true
    },
    async deleteGame (value) {
      this.setGamesLoaded(false)
      this.$q.loading.show({
        message: '<b>Adding New Games</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      try {
        const gamesRef = firebaseStore.collection('gameDates')
        await gamesRef.doc(this.id).delete()
        this.setGamesLoaded(true)
        this.game = {}
        this.id = ''
        this.confirm = false
        this.$q.loading.hide()
      } catch (error) {
        switch (error) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error deleting game: ' + error)
        }
        this.setGamesLoaded(true)
        this.game = {}
        this.id = ''
        this.confirm = false
        this.$q.loading.hide()
      }
    },
    sendInvite () {

    },
    async saveGame (game) {
      this.setGamesLoaded(false)
      this.$q.loading.show({
        message: '<b>Adding New Games</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      try {
        const gameID = game.id
        const gameDateTime = `${game.gameDate} ${game.gameTime}`
        const gameTimeStamp = Timestamp.fromDate(new Date(gameDateTime))

        // Strip out currency format
        const buyIn = game.buyIn.replace(/^\W|,/g, '')
        const rebuy = game.rebuy.replace(/^\W|,/g, '')
        const addOn = game.addOn.replace(/^\W|,/g, '')

        const saveGame = {
          type: game.type,
          gameDate: gameTimeStamp,
          complete: false,
          structure: game.structure,
          buyIn: buyIn,
          rebuy: rebuy,
          addOn: addOn,
          seasonTourney: game.seasonTourney,
          location: game.location,
          notes: game.notes
        }
        const gamesRef = firebaseStore.collection('gameDates')
        if (this.mode === 'add') {
          await gamesRef.add(saveGame)
        } else {
          await gamesRef.doc(gameID).update(saveGame)
        }
        this.setGamesLoaded(true)
        this.game = {}
        this.showEditGame = false
        this.$q.loading.hide()
      } catch (error) {
        switch (error) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error saving game: ' + error)
        }
      }
    },
    enterResults (value) {
      this.setTournamentID(value)
      this.$router.push({ name: 'EnterResults' }).catch((error) => {
        showMessage('error', `Problem handling something: ${error}.`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .schedule-section {
    position: relative;
    font-size: 18px;

    * {
      box-sizing: border-box;
    }

    &__games {
      position: relative;
      width: 100%;
      height: 92%;
      background: $off-white 0% 0% no-repeat padding-box;
      opacity: .85;
      display: grid;
      grid-template-columns: 1fr;

      &--table {
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;
        max-width: 120rem;
        padding: 0px;

        .no-games {
          max-width: 90vw;
          font-size: 2.4rem;

        }

        li {
          list-style: none;
        }

        .heading-row {
          position: sticky;
          top: 0;
          z-index: 1;
          background-color: $white;
          opacity: 1;
          height: 5rem;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: grid;
          grid-column-gap: 1.6rem;

          .attribute-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

            .attribute.buy-in {
              justify-self: center;
            }
            .attribute.structure {
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
          }
          .attribute-container.game-structure {
              --column-width-min: 5.5em;
          }
          .attribute-container.game-buttons {
            --column-width-min: 2em;
            justify-self: center;
          }
        }
        .heading-row.isAdmin {
          grid-template-columns:  12rem 3.5fr 1fr 2fr;
        }

        .heading-row.isNotAdmin {
          grid-template-columns:  12rem 4fr 1fr;
        }

      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 800px) {
  .heading-row.isAdmin {
    grid-template-columns:  7.8rem 3.5fr 1fr 2fr !important;
  }

  .heading-row.isNotAdmin {
    grid-template-columns:  7.8rem 4fr 1fr !important;
  }
}

@media screen and (max-width: 534px) {
  .attribute-container {
    .attribute.buy-in {
      justify-self: flex-start !important;
    }
  }
}

@media screen and (max-width: 474px) {
  .schedule-section__games {
    height: 90%;
  }
}

@media screen and (max-width: 535px) {
  .heading-row {
    height: 7.5rem !important;
  }

  .attribute-container.game-structure {
      --column-width-min: 5.5em!important;
  }
}
</style>
