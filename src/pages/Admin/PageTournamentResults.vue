<template>
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
    <q-page style="min-height: inherit;">
      <div
        class="container"
        v-if="weeklyResultsLoaded && finishedLoaded && leagueInfoLoaded"
      >
        <div class="row header">
          <div class="col-12">
            <div class="header__title text-center text-h3 q-mt-md">
              Tournament Results
            </div>
          </div>
          <div class="col-12">
            <div class="header__date text-center">
              {{ txtTournamentDate }}
            </div>
          </div>
          <div class="header__subheading">
            <div class="attribute-container header_searchbox">
              <div class="header__search-bar q-pa-xs">
                <search />
                <!-- <sort-field /> -->
              </div>
            </div>
            <div class="attribute-container total-information">
              <div class="attribute ">Total checked in: {{ numCheckedIn }}</div>
              <div class="attribute">Total knocked out: {{ numFinished }}</div>
              <div class="attribute">Total remaining: {{ remaining }}</div>
            </div>
            <div class="attribute-container button-section">
              <div class="attribute edit-button" v-if="!reorderFlag">
                <q-btn
                  color="white"
                  icon="edit"
                  round
                  text-color="black"
                  align="center"
                  size="md"
                  @click="setReorderFlag(true)"
                >
                </q-btn>
              </div>
              <div class="attribute edit-button" v-else>
                <q-btn
                  color="white"
                  round
                  icon="check_circle_outline"
                  text-color="black"
                  align="center"
                  size="md"
                  @click="setReorderFlag(false)"
                >
                  <q-tooltip>
                    Edit the finish order.
                  </q-tooltip>
                </q-btn>
              </div>
              <div class="attribute payout-button text-center">
                <q-btn
                  color="green"
                  round
                  icon="monetization_on"
                  text-color="white"
                  align="center"
                  size="md"
                  :disabled="reorderFlag"
                  @click="enterPayouts"
                >
                  <q-tooltip>
                    Finalize the order and enter payouts.
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="results-section">
          <div class="results-section__left-column">
            <players-list
              :players="remainingPlayers"
              :type="'checked-in'"
            >
            </players-list>

          </div>

          <div
            v-if="!reorderFlag"
            class="results-section__right-column"
          >
            <players-list
              :players="finishedPlayers"
              :type="'finished'"
            >
            </players-list>
          </div>
          <div
            v-else
            class="results-section__right-column"
          >
            <reorder-players
              :remaining="remaining"
              :type="'finished'"
            >
            </reorder-players>
          </div>
        </div>
        <q-dialog v-model="showProceed" persistent>
          <q-card style="min-width: 250px">
            <q-card-section>
              <div class="text-h4">Proceed?</div>
            </q-card-section>
            <q-card-section>
              {{ proceed_msg }}
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn  color="blue-10" label="Yes" @click="$router.push({ name: 'EnterPayouts' })" />
              <q-btn color="negative" label="No" @click="showProceed=false"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'
// import { firebaseStore, firebaseFunctions } from 'boot/firebase'
import { firebaseStore } from 'src/boot/firebase'
import { showMessage } from 'src/functions/functions-common'
import { date } from 'quasar'

export default {
  name: 'TournamentResults',
  components: {
    playersList: require('components/Admin/Results/ResultsPlayersList.vue').default,
    reorderPlayers: require('components/Admin/Results/PlayersListReorder.vue').default,
    // sortField: require('components/Shared/Sort.vue').defaul,
    search: require('components/Admin/Results/Search.vue').default
  },
  mixins: [mixinAddEditPlayer],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showAddPlayer: false,
      showProceed: false,
      proceed_msg: '',
      reorder: false,
      results: 0
    }
  },
  watch: {
    tournamentResults: function () {
      this.getNumCheckedIn()
      this.setResultsLoaded(true)
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded']),
    ...mapGetters('tourneyResults', ['tournamentID', 'tournamentResults', 'weeklyResultsLoaded', 'finishedLoaded', 'finishedPlayers']),
    ...mapGetters('tourneyResults', ['reorderFlag', 'resultsSorted', 'resultsFiltered', 'remainingPlayers', 'numCheckedIn', 'tournamentInfo']),
    txtTournamentDate: function () {
      return date.formatDate(this.tournamentInfo.gameDate.toDate(), 'dddd MMMM D')
    },
    remaining: function () {
      return this.numCheckedIn - this.numFinished
    },
    numFinished: function () {
      if (this.tournamentResults) {
        return Object.keys(this.finishedPlayers).length
      } else {
        return null
      }
    }

  },
  methods: {
    ...mapActions('tourneyResults', ['fbWeeklyResults', 'fbEventInfo', 'fbTournamentInfo', 'setResultsLoaded', 'getFinishedPlayersLS']),
    ...mapActions('tourneyResults', ['resortFinishedPlayers', 'getNumCheckedIn', 'setSort', 'setReorderFlag', 'setFinishedLoaded']),
    enterPayouts () {
      if (this.remaining > 0) {
        this.proceed_msg = `There are still ${this.remaining} remaining players.  If you continue their results won't count.  Do you still want to proceed?`
        this.showProceed = true
      } else {
        this.$router.push({ name: 'EnterPayouts' })
      }
    }
  },
  async beforeMount () {
    if (this.tournamentID) {
      await this.fbTournamentInfo(this.tournamentID)
      // Get tournament results if loaded.  If not loaded, call function to create
      await this.fbWeeklyResults(this.tournamentID)
      if (this.tournamentInfo.type && !this.tournamentResults.length) {
        try {
          // TO-DO: convert to FB function
          // First check tournaments loaded just in case vuexFire is lagging
          const resultsRef = firebaseStore.collection('tournamentResults')
            .where('gameID', '==', this.tournamentID)
            .limit(1)
          const snapShot = await resultsRef.get()
          if (snapShot.empty) {
            // const createResults = firebaseFunctions.httpsCallable('createTournamentResults')
            // createResults({ event: this.tournamentInfo }).then(result => {
            //   const msg = 'Results created'
            //   showMessage(msg)
            // })
            createTournamentResults(this.tournamentInfo, this.tournamentID).then(async () => {
              // Reload results
              await this.fbWeeklyResults(this.tournamentID)
            })
          }
        } catch (error) {
          showMessage('error', `Error loading results, error: ${error.message}`)
          this.updating = false
        }
      }
    }
    this.getFinishedPlayersLS()
    this.getNumCheckedIn()
    this.setSort('onlineName')
  }
}
async function createTournamentResults (tournamentInfo, id) {
  try {
    const playersRef = firebaseStore.collection('players')

    // For each player add a new invite to invitations collection
    const snapshot = await playersRef.get()
    if (!snapshot.empty) {
      const promises = []
      const resultsRef = firebaseStore.collection('tournamentResults')
      snapshot.forEach(async player => {
        const newPlayer = {
          gameDate: tournamentInfo.gameDate,
          gameID: id,
          playerID: player.id,
          firstName: player.data().firstName,
          lastName: player.data().lastName,
          nickName: player.data().nickName,
          onlineName: player.data().onlineName,
          avatar: player.data().avatar,
          RSVPd: false,
          checkedIn: false,
          finished: false,
          finishedPosition: 0
        }
        promises.push(resultsRef.add(newPlayer))
      })
      return Promise.all(promises)
    }
  } catch (error) {
    const updateCode = error.code
    const updatdeMessage = error.message
    const updateError = `Error creating tournament results :  ${updateCode} -  ${updatdeMessage}`
    console.log(updateError)
    return new Error(error)
  }
}

</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }
  .container {
    position: relative;
    height: 100vh;
    width: 100%;
    background-image: url(WSOP_Final_Table_Stretched.jpg);
    background-size: cover;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color: rgba(0,0,0,0.6);
    }

    .header {
      color: white;
      position: relative;
      width: 100%;

      &__search-bar {
        position: relative;
        max-width: 60%;
        border-radius: 5px;
        opacity: .75;
        margin-top: 2rem;
        margin-left: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__subheading {
        width: 100%;
        display: grid;
        grid-template-columns: 6fr 2fr 2fr;

        .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

        }

        .button-section {
          --column-width-min: 7.2em;

          .edit-button {
            justify-self: flex-end;
          }

          .payout-button {
            justify-self: flex-start;
          }
        }

        .edit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: end;
        }
      }
    }

    .results-section {
      position: relative;
      height: 66vh;
      width: 97%;
      display: grid;
      grid-template-columns: 5fr 4fr;
      justify-content: center;
      align-items: flex-start;
      grid-gap: 3rem;

      &__left-column {
        width: 100%;
        height: 100vh;
        position: relative;

      }

    }
    .button-section {
      position: relative;
      width: 100%;
      display: grid;
      grid-template-columns: 5fr 4fr;
      justify-content: center;
      align-items: center;
      grid-gap: 3rem;
      margin-top: 3rem;
    }
  }

  .player-dialog {
    max-width: 50vh;
  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;

      .left-column {
        width: 93%;

        &__search-bar {
          width: 70%;
        }

        &__player-rankings {
          width: 98%;
        }
      }

    }

  }
</style>
