<template>
  <q-page style="min-height: inherit;">
    <div
      class="container"
      :class="showForm"
      v-if="finishedLoaded"
    >
      <div :class="showForm">
        <div v-if="showForm === 'pool'">
          <payout-pool
            :formData.sync="formData"
            :tournament_date="tournament_date"
            :structure="structure"
            @enterPayouts="enterPayouts"
            @cancel="$router.push({ name: 'EnterResults' })"
          >
          </payout-pool>
        </div>
        <div class="col justify-center payout-section__form" v-else>
          <payout-places
            :formData.sync="formData"
            :tournament_date="tournament_date"
            :structure="structure"
            @goBack="showForm='pool'"
            @cancel="$router.push({ name: 'EnterResults' })"
            @finish="confirm=true"
          >
          </payout-places>
        </div>
      </div>
    </div>
    <q-dialog
      v-model="confirm"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h3">Confirm Finish:</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          This will update weekly results and season standings. Proceed?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn label="OK" color="blue-10" @click="finish" />
          <q-btn label="Cancel" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'
import { firebaseStore } from 'boot/firebase'
// import { firebaseStore, firebaseFunctions, Timestamp } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export default {
  name: 'PageTournamentPayouts',
  components: {
    payoutPool: require('components/Admin/Results/PayoutPool.vue').default,
    payoutPlaces: require('components/Admin/Results/PayoutPlaces.vue').default
  },
  data () {
    return {
      showForm: 'pool',
      confirm: false,
      formData: {
        prizePool: 0,
        finalTable: 0,
        playerOfTheYear: 0,
        DGW: 0,
        payoutTotal: 0,
        finalTablePlayers: 9,
        payouts: [
          {
            label: '1st',
            amount: 0
          },
          {
            label: '2nd',
            amount: 0
          },
          {
            label: '3rd',
            amount: 0
          },
          {
            label: '4th',
            amount: 0
          },
          {
            label: '5th',
            amount: 0
          },
          {
            label: '6th',
            amount: 0
          },
          {
            label: '7th',
            amount: 0
          },
          {
            label: '8th',
            amount: 0
          },
          {
            label: '9th',
            amount: 0
          },
          {
            label: '10th',
            amount: 0
          }
        ],
        placesPaid: 0
      }
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded', 'points']),
    ...mapGetters('tourneyResults', ['finishedLoaded', 'tournamentInfo', 'finishedPlayers']),
    txtNextDate: function () {
      return date.formatDate(this.tournamentInfo.gameDate.toDate(), 'dddd MMMM D')
    },
    tournament_date: function () {
      return `Tournament Date: ${this.txtNextDate}`
    },
    structure: function () {
      return `${this.tournamentInfo.buyIn} ${this.tournamentInfo.structure}`
    },
    prizePool: function () {
      let amount = 0
      amount = this.formData.prizePool.replace(/^\W|,/g, '')
      return parseFloat(amount)
    },
    finalTable: function () {
      let amount = 0
      amount = this.formData.finalTable.replace(/^\W|,/g, '')
      return parseFloat(amount)
    },
    playerOfTheYear: function () {
      let amount = 0
      amount = this.formData.playerOfTheYear.replace(/^\W|,/g, '')
      return parseFloat(amount)
    },
    DGW: function () {
      let amount = 0
      amount = this.formData.DGW.replace(/^\W|,/g, '')
      return parseFloat(amount)
    },
    payoutTotal: function () {
      let amount = 0
      amount = this.formData.payoutTotal.replace(/^\W|,/g, '')
      return parseFloat(amount)
    },
    payouts: function () {
      let amount = 0
      const payouts = []
      for (let i = 0; i <= this.formData.placesPaid - 1; i++) {
        amount = this.formData.payouts[i].amount.replace(/^\W|,/g, '')
        amount = parseFloat(amount)
        payouts.push(amount)
      }
      return payouts
    }
  },
  methods: {
    ...mapActions('tourneyResults', ['clearResultsInfo']),
    enterPayouts (value) {
      // Calculate prize money
      const total = this.finalTable + this.playerOfTheYear + this.DGW
      this.formData.payoutTotal = this.prizePool - total

      this.showForm = value
    },

    goBack (value) {
      console.log('showForm: ', this.showForm)
    },

    async finish () {
      let message = '',
        messageType = ''

      // Update league bank values
      this.$q.loading.show({
        message: '<b>Updating results</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      this.confirm = false

      // Create weekly results documents
      this.updateWeeklyResults()
        .then(async () => {
          this.updateBank()
            .then(async () => {
              try {
                await this.markGameComplete()
                message = 'Weekly totals updates finished successfully'
                messageType = 'Success'
                this.$q.loading.hide()
                showMessage(messageType, message)
                this.clearResultsInfo()
                this.$router.push({ name: 'home' })
              } catch (error) {
                message = `Something went wrong updating league bank totals. Take a screenshot of the error and send to Roger. Error: ${error.message}`
                messageType = 'Error'
                this.$q.loading.hide()
                showMessage(messageType, message)
              }
            })
            .catch(error => {
              message = `Something went wrong updating league bank totals. Take a screenshot of the error and send to Roger. Error: ${error.message}`
              messageType = 'Error'
              this.$q.loading.hide()
              showMessage(messageType, message)
            })
        })
        .catch(error => {
          message = `Something went wrong updating season standings. Take a screenshot of the error and send to Roger. Error: ${error.message}`
          messageType = 'Error'
          this.$q.loading.hide()
          showMessage(messageType, message)
        })
    },
    async updateBank () {
      // Make sure to use the computed property that strips the $ signg
      const bank = {
        playerOfTheYear: this.leagueInfo.bank.playerOfTheYear + this.playerOfTheYear,
        finalTable: this.leagueInfo.bank.finalTable + this.finalTable,
        DGW: this.leagueInfo.bank.DGW + this.DGW
      }
      const leagueRef = firebaseStore.collection('leagueInfo').doc('1')
      return await leagueRef.update({
        bank: bank
      })
    },

    async markGameComplete () {
      const gamesRef = firebaseStore.collection('gameDates').doc(this.tournamentInfo.id)
      return await gamesRef.update({
        complete: true
      })
    },

    async updateWeeklyResults () {
      if (Object.keys(this.finishedPlayers).length) {
        const resultsRef = firebaseStore.collection('weeklyResults')
        const promises = []
        Object.values(this.finishedPlayers).forEach(player => {
          let position = 0
          if (player.finishedPosition <= this.formData.finalTablePlayers) {
            player.finalTable = true
            position = player.finishedPosition
          } else {
            position = this.formData.finalTablePlayers + 1
          }
          player.points = this.points[position - 1].points

          if (player.finishedPosition <= this.formData.placesPaid) {
            let amount = 0
            amount = this.formData.payouts[player.finishedPosition - 1].amount.replace(/^\W|,/g, '')
            player.prizeMoney = parseFloat(amount)
          } else {
            player.prizeMoney = 0
          }

          const newResult = {
            playerID: player.playerID,
            gameID: this.tournamentInfo.id,
            gameDate: this.tournamentInfo.gameDate,
            finishedPosition: player.finishedPosition,
            finalTable: player.finalTable,
            points: player.points,
            prizeMoney: player.prizeMoney
          }
          promises.push(resultsRef.add(newResult))
        })
        return Promise.all(promises)
      }
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
    color: black;
    height: 90vh;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent radial-gradient(closest-side at 53% 47%, #AC4745 0%, #1E1F20 100%) 0% 0% no-repeat padding-box;
    }
    .pool {
      width: 55rem;
      margin-top: 3rem;
    }
    .places {
      width: 60rem;
      margin-top: 3rem;
    }
  }

</style>
