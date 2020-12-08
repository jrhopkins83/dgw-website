<template>
  <div>
    <section class="games-section">
      <div class="games-section__games q-mb-sm">
        <template v-if="!Object.keys(upcomingGames).length && !Object.keys(completedGames).length">
          <div>
            <no-games
              :message='noGamesMsg'
            >
            </no-games >
          </div>
        </template>
        <template v-else>
          <ol class="collection collection-container games-section__games--table q-mb-sm">
            <!-- The first list item is the header of the table -->
            <li class="item item-container heading-row q-mt-xs" :class="isAdmin">
              <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class="attribute-container game-information">
                <div class="attribute date">Date</div>
                <div class="attribute buy-in">Buy-In</div>
                <div class="attribute type">Type</div>
              </div>
              <div class="attribute-container game-structure">
                <div class="attribute structure">Structure</div>
                <div class="attribute details"></div>
              </div>
              <div class="attribute-container game-buttons text-center" v-if="adminButtons" >Actions
                <div class="attribute edit"></div>
                <div class="attribute delete"></div>
                <div class="attribute invite"></div>
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
              @editGame="editGame"
              @deleteGame="deleteGame"
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
              @edit="editGame"
              @delete="deleteGame"
            >
            </game-row>
        </ol>
        </template>
      </div>

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
    </section>
      <q-dialog
        v-model="showEditGame"
      >
        <game-details
          :game="game"
          :id="id"
          :mode="mode"
          @save="saveGame"
          @close="showEditGame=false"
        />
      </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { firebaseStore, Timestamp } from 'src/boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export default {
  components: {
    gameRow: require('src/components/Schedule/Game.vue').default,
    gameDetails: require('src/components/Admin/EditGameDetails.vue').default,
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
      mode: '',
      game: {},
      id: ''
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['userInfo']),
    noGamesMsg: function () {
      return 'No games with that criteria'
    }
  },
  methods: {
    ...mapActions('games', ['setGamesLoaded']),
    addGame () {
      this.mode = 'add'
      this.showEditGame = true
    },
    editGame (value) {
      this.mode = 'edit'
      this.game = value[0]
      this.id = value[1]
      this.showEditGame = true
    },
    deleteGame () {

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
          structure: game.structure,
          buyIn: buyIn,
          rebuy: rebuy,
          addOn: addOn,
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
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error saving game: ' + err)
        }
      }
    },
    enterResults (value) {
      this.setTournamentID(value)
      this.$router.push({ name: 'EnterResults' }).catch((err) => {
        showMessage('error', `Problem handling something: ${err}.`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .games-section {
    font-size: 18px;

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

    &__games {
      height: 73vh;
      width: 100%;
      overflow: scroll;
      border-radius: 2.5rem;
      opacity: 0.8;

      .no-games {
        max-width: 90vw;
        font-size: 2.4rem;

      }
      &--table {
        margin: 0 .6rem .6rem .6rem;
        position: relative;
        max-width: 120rem;

        .heading-row {
          position: sticky;
          top: 0;
          color:  black;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          text-decoration-line: underline;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: grid;

          .attribute-container.game-information {
            display: grid;
            grid-template-columns: 8rem 6rem 6rem;
            grid-gap: 8px;
          }

          .attribute-container.game-structure {
            display: grid;
            grid-template-columns: 20rem 5rem;

            .attribute.structure {
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
          }

          .attribute-container.game-buttons {
            display: grid;
            grid-template-columns: repeat(4, 4rem);;
          }

        }
        .heading-row.isAdmin {
          grid-template-columns: 1fr 1.5fr 1fr;
        }
        .heading-row.isNotAdmin {
          grid-template-columns: 1fr 1.5fr;
        }
      }
    }
  }

.q-page {
  min-height: auto;
}

.dialog-game {
  background-color: #707070;
  display: flex;
  height: 90%;
  width: 90%;
}
@media screen and (max-width: 600px) {
  .online-name-header {
    display: none;
  }
}

/* Tabular Layout */

</style>
