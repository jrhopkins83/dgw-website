<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      v-if="resultsLoaded && leagueInfoLoaded"
    >
      <div class="row header">
        <div class="col-12">
          <div class="header__title text-center text-h3 q-mt-md">
            Tournament Results
          </div>
        </div>
        <div class="col-12">
          <div class="header__date text-center">
            {{ txtNextDate }}
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
          <div class="edit-button" v-if="!reorder">
            <q-btn
              color="white"
              label="Edit"
              text-color="black"
              align="center"
              size="sm"
              @click="reorder=true"
            />
          </div>
          <div class="edit-button" v-else>
            <q-btn
              color="white"
              label="Done"
              text-color="black"
              align="center"
              size="sm"
              @click="reorder=false"
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
          v-if="!reorder"
          class="results-section__right-column"
        >
          <players-list
            :players="finishedPlayersSorted"
            :type="'finished'"
          >
          </players-list>
        </div>
        <div
          v-else
          class="results-section__right-column"
        >
          <reorder-players
            :players="finishedPlayersSorted"
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
        <div class="text-center">
          <q-btn
            color="blue-8"
            label="Enter Payouts"
            text-color="white"
            align="center"
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
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'
// import { firebaseStore } from 'boot/firebase'
// import { showMessage } from 'src/functions/functions-common'
import { date } from 'quasar'
import { firebaseStore } from 'src/boot/firebase'

export default {
  name: 'TournamentResults',
  components: {
    search: require('components/Admin/Results/Search.vue').default,
    addPlayer: require('components/Players/Modals/AddPlayer.vue').default,
    playersList: require('components/Admin/Results/PlayersList.vue').default,
    reorderPlayers: require('components/Admin/Results/PlayersListReorder.vue').default
  },
  mixins: [mixinAddEditPlayer],
  data () {
    return {
      showAddPlayer: false,
      reorder: false,
      results: 0
    }
  },
  watch: {
    tournamentResults: function () {
      this.getFinishedPlayersLS()
      this.getNumCheckedIn()
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded']),
    ...mapGetters('tourneyResults', ['tournamentResults', 'resultsLoaded', 'finishedPlayers', 'finishedPlayersSorted']),
    ...mapGetters('tourneyResults', ['resultsSorted', 'remainingPlayers', 'numCheckedIn', 'numFinished', 'tournamentInfo']),
    txtNextDate: function () {
      return date.formatDate(this.leagueInfo.nextTourneyDate.toDate(), 'dddd MMMM D')
    },
    remaining: function () {
      return this.numCheckedIn - this.finishedPlayersSorted.length
    },
    resultsLength: function () {
      if (this.tournamentResults) {
        return Object.keys(this.tournamentResults)
      } else {
        return null
      }
    }

  },
  methods: {
    ...mapActions('tourneyResults', ['fbResults', 'setResultsLoaded', 'getFinishedPlayersLS', 'getNumCheckedIn', 'fbEventInfo', 'fbTournamentInfo']),
    async loadTournamentResults () {
    },
    async savePlayer (newPlayer) {
      const newPlayerNames = {
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        nickName: newPlayer.nickName,
        onlineName: newPlayer.onlineName

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
          this.showAddPlayer = false
        } else {
          return false
        }
      }
    },
    setTournamentResults () {
      this.getFinishedPlayersLS()
      this.getNumCheckedIn()
      this.setResultsLoaded(true)
    }
  },
  async beforeMount () {
    if (this.leagueInfo.nextTourneyDate) {
      await this.fbTournamentInfo(this.leagueInfo.nextTourneyDate)
      await this.fbResults(this.leagueInfo.nextTourneyDate)
      this.setTournamentResults()
    }
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
