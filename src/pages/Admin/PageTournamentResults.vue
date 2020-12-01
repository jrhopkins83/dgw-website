<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      v-if="resultsLoaded && finishedLoaded && leagueInfoLoaded"
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
              <search>
              </search>
            </div>
          </div>
          <div class="attribute-container total-information">
            <div class="attribute ">Total checked in: {{ numCheckedIn }}</div>
            <div class="attribute">Total knocked out: {{ numFinished }}</div>
            <div class="attribute">Total remaining: {{ remaining }}</div>
          </div>
          <div class="edit-button" v-if="!reorderFlag">
            <q-btn
              color="white"
              label="Edit"
              text-color="black"
              align="center"
              size="sm"
              @click="setReorderFlag(true)"
            />
          </div>
          <div class="edit-button" v-else>
            <q-btn
              color="white"
              label="Done"
              text-color="black"
              align="center"
              size="sm"
              @click="setReorderFlag(false)"
            />
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
      <div class="button-section">
        <div class="text-center">
          <q-btn
            color="grey-4"
            label="Add Player"
            text-color="black"
            align="center"
            @click="showAddPlayer=true"
          />
        </div>
        <div class="text-center" v-if="!reorderFlag">
          <q-btn
            color="blue-8"
            label="Enter Payouts"
            text-color="white"
            align="center"
            @click="enterPayouts"
          />
        </div>
      </div>
      <q-dialog v-model="showAddPlayer">
        <add-player
          :player="null"
          @save="savePlayer"
          @close="showAddPlayer=false"
        />
      </q-dialog>
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
    search: require('components/Admin/Results/Search.vue').default,
    addPlayer: require('components/Players/Modals/AddPlayer.vue').default,
    playersList: require('components/Admin/Results/PlayersList.vue').default,
    reorderPlayers: require('components/Admin/Results/PlayersListReorder.vue').default
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
    ...mapGetters('tourneyResults', ['tournamentID', 'tournamentResults', 'resultsLoaded', 'finishedLoaded', 'finishedPlayers']),
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
    ...mapActions('tourneyResults', ['fbResults', 'fbEventInfo', 'fbTournamentInfo', 'setResultsLoaded', 'getFinishedPlayersLS']),
    ...mapActions('tourneyResults', ['resortFinishedPlayers', 'getNumCheckedIn', 'setReorderFlag', 'setFinishedLoaded']),
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
      await this.fbResults(this.tournamentID)
      if (this.tournamentInfo.type && !this.tournamentResults.length) {
        try {
          // TO-DO: convert to FB function
          // First check tournaments loaded just in case vuexFire is lagging
          const resultsRef = firebaseStore.collection('tournamentResults')
            .where('eventID', '==', this.tournamentID)
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
              await this.fbResults(this.tournamentID)
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
          date: tournamentInfo.date,
          eventID: id,
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
        grid-template-columns: 7fr 4fr 10em;

        .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

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
