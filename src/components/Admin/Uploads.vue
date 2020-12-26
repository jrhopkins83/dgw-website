<template>
  <div
    class="q-pa-xs"
    style="max-width: 400px"
    v-if="true"
  >
    <q-card class="my-card">
      <q-card-section class="q-pa-xs">
        <div class="text-subtitle1 text-weight-bold text-center">Bulk Uploads</div>
      </q-card-section>

      <q-separator />

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions
              class="q-mb-xs justify-evenly"
              align="center"
            >
              <q-btn
                color="blue-6"
                label="Upload dates"
                @click="dates=true"
              />
            </q-card-actions>
          </q-card>
          <q-dialog
            v-model="dates"
          >
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="dateFile" value="Import"/>
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="uploadDates" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears
              size="50px"
              color="blue-9"
            />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions
              class="q-mb-xs justify-evenly"
              align="center"
            >
              <q-btn
                color="blue-6"
                label="Upload players"
                @click="players=true"
              />
            </q-card-actions>
          </q-card>
          <q-dialog
            v-model="players"
          >
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="playerFile" value="Import"/>
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="bulkUpload" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears
              size="50px"
              color="blue-9"
            />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions
              class="q-mb-xs justify-evenly"
              align="center"
            >
              <q-btn
                color="blue-6"
                label="Upload Standings"
                @click="standings=true"
              />
            </q-card-actions>
          </q-card>
          <q-dialog
            v-model="standings"
          >
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="standingsFile" value="Import"/>
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="uploadStandings" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears
              size="50px"
              color="blue-9"
            />
          </q-inner-loading>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { toTitleCase, showMessage } from 'src/functions/functions-common'
import { firebaseStore, firebaseFunctions, Timestamp } from 'boot/firebase'
import { mapActions, mapGetters } from 'vuex'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'

export default {
  components: {

  },
  mixins: [mixinAddEditPlayer],
  data () {
    return {
      league: false,
      players: false,
      dates: false,
      standings: false,
      updating: false,
      gameDates: [],
      pointsAssignment: [{}],
      playerToSubmit: {},
      usersAdded: 0,
      playersAdded: 0,
      playerRefsAdded: 0
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded'])
  },
  methods: {
    ...mapActions('leagueSettings', ['fbLeagueInfo']),
    async bulkUpload () {
      // Upload JSON formatted file with players
      const files = document.getElementById('playerFile').files
      if (files.length <= 0) {
        return false
      }
      const reader = new FileReader()

      reader.onload = async e => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          this.gameDates = await this.getLeagueDates()
          if (this.gameDates.length) {
            results.forEach(async (player) => {
              try {
                let uid = null
                let nickName = null
                let onlineName = null
                if (player.email) {
                  uid = await this.createNewUser(player.email, 'dgw2020')
                }
                if (uid) {
                  player.uid = uid
                }
                if (player.nickName.length > 0) {
                  nickName = player.nickName.trim()
                }
                if (player.onlineName.length > 0) {
                  onlineName = player.onlineName.trim()
                }
                const newPlayer = {}
                newPlayer.uid = player.uid
                newPlayer.firstName = toTitleCase(player.firstName).trim()
                newPlayer.lastName = toTitleCase(player.lastName).trim()
                newPlayer.nickName = nickName
                newPlayer.onlineName = onlineName

                player.playerID = await this.addNewPlayer(newPlayer)

                if (player.playerID) {
                  const playerContactInfo = {
                    playerID: player.playerID,
                    email: player.email,
                    phoneNumber: null,
                    emailOptin: true,
                    notificationOptin: true
                  }
                  await this.createSubscriber(playerContactInfo)
                  const playerTotals = await this.uploadWeeklyResults(player)
                  await this.createPlayerStanding(player, playerTotals)
                }
                if (player.playerID && player.uid) {
                  const userRef = {
                    playerID: player.playerID,
                    uid: player.uid
                  }
                  await this.createUserPlayerRef(userRef)
                }
              } catch (error) {
                console.error('Error adding document: ', error)
              }
            })
          }
        }
      }
      this.players = false
      reader.readAsText(files.item(0))
    },
    async uploadWeeklyResults (player) {
      try {
        const playerTotals = {
          places: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          finalTables: 0,
          totalGames: 0
        }
        // get point assignments
        const pointsAssignments = await this.getPointAssignments()
        if (pointsAssignments) {
          // for each date get points value
          const dateKeys = Object.keys(player)
          dateKeys.forEach(async (key) => {
            const keyDate = key + ' 19:00:00'
            const keyDtTime = Timestamp.fromDate(new Date(keyDate))
            if (keyDtTime.seconds && player[key] > 0) {
              // Get date ID from date key
              const index = this.gameDates.findIndex(item => item.txtDate === key)
              if (index >= 0) {
                const gameID = this.gameDates[index].id
                // Lookup position based on points
                let position = 0
                const weekPoints = player[key]
                let finalTable = false
                if (weekPoints > 0) {
                  playerTotals.totalGames = playerTotals.totalGames + 1
                  if (weekPoints === 1) {
                    position = 10
                  } else {
                    const index = pointsAssignments.findIndex(item => item.points === player[key])
                    position = pointsAssignments[index].position
                    const totalIndex = position - 1
                    playerTotals.places[totalIndex] = playerTotals.places[totalIndex] + 1
                    playerTotals.finalTables = playerTotals.finalTables + 1
                    if (position <= 9) {
                      finalTable = true
                    }
                  }
                }

                // Add new document for the date
                const newResult = {
                  playerID: player.playerID,
                  gameID: gameID,
                  gameDate: keyDtTime,
                  finishedPosition: position,
                  points: weekPoints,
                  finalTable: finalTable,
                  prizeMoney: 0
                }
                await firebaseStore.collection('weeklyResults').add(newResult)
              }
            }
          })
        }
        return playerTotals
      } catch (error) {
        console.log(`Error adding weekly results: ${error.message}`)
        return null
      }
    },
    async createWeeklyResult (playerPoints) {
      try {
        const data = JSON.parse(JSON.stringify(playerPoints))
        const docID = await firebaseStore.collection('weeklyResults').set(data)
        return docID
      } catch (error) {
        console.log(`Error creating weekly result: ${error.message}`)
        return null
      }
    },
    async createPlayerStanding (player, playerTotals) {
      try {
        const playerID = player.playerID
        const newStanding = {
          season: '2020',
          totalPoints: player.points,
          games: player.games,
          winnings: 0,
          pts_game: player.pts_game,
          total1st: playerTotals.places[0],
          total2nd: playerTotals.places[1],
          total3rd: playerTotals.places[2],
          total4th: playerTotals.places[3],
          finalTables: playerTotals.finalTables
        }
        const seasonStandings = firebaseStore.collection('seasonStandings')
        return seasonStandings.doc(playerID).set(newStanding)
      } catch (error) {
        console.log(`Error adding standing: ${error.message}`)
      }
    },
    async createNewUser (email) {
      const createUser = firebaseFunctions.httpsCallable('createUser')
      const password = 'test123'
      try {
        const newUser = await createUser({ email, password })
        return newUser.data.uid
      } catch (error) {
        console.log('error creating user: ', error)
        return null
      }
    },
    async uploadStandings () {
      // Upload JSON formatted file with players
      const files = document.getElementById('standingsFile').files
      if (files.length <= 0) {
        return false
      }
      const reader = new FileReader()

      reader.onload = e => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          const newPlayer = {}
          results.forEach(async (player) => {
            try {
              // Look up player ID by e-mail
              newPlayer.playerID = await this.lookupPlayerByEmail(player.email)
              if (!newPlayer.playerID) {
              } else {
                newPlayer.season = '2020' // TO-DO - get from league info collection
                newPlayer.position = player.position
                newPlayer.points = player.points
                newPlayer.numGames = player.games
                newPlayer.pts_game = player.pts_game
                newPlayer.winnings = 0.00
                await this.newPlayerStanding(newPlayer)
              }
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
        }
      }
      reader.readAsText(files.item(0))
    },
    async getPointAssignments () {
      try {
        // get point assignments
        const pointAssignmentRef = firebaseStore.collection('leagueInfo').doc('1')
          .collection('pointsAssignments')
          .orderBy('position')
        const pointsSnap = await pointAssignmentRef.get()

        if (!pointsSnap.empty) {
          const pointsAssignments = []
          pointsSnap.forEach(doc => {
            pointsAssignments.push(doc.data())
          })
          return pointsAssignments
        }
      } catch (error) {
        console.log(`Error adding result: ${error.message}`)
        return null
      }
    },
    async getLeagueDates () {
      try {
        const gameDatesRef = firebaseStore.collection('gameDates')
          .orderBy('gameDate')
        const datesSnap = await gameDatesRef.get()
        if (!datesSnap.empty) {
          const gameDates = []
          datesSnap.forEach(async (doc) => {
            const leagueDate = {
              id: doc.id,
              txtDate: doc.data().txtDate,
              gameDate: doc.data().gameDate
            }
            gameDates.push(leagueDate)
          })
          return gameDates
        } else {
          console.log('No dates found')
          return null
        }
      } catch {
        console.log('Error getting dates')
        return null
      }
    },
    async uploadDates () {
      // Upload JSON formatted file with players
      const files = document.getElementById('dateFile').files
      if (files.length <= 0) {
        showMessage('No dates found in that file')
        return false
      }
      const reader = new FileReader()

      reader.onload = e => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          const newGame = {}
          const lastCompletedDate = '11/25/2020 19:00:00'
          const lastCompletedDtTm = Timestamp.fromDate(new Date(lastCompletedDate))
          results.forEach(async (game) => {
            try {
              if (game.gameDate.length) {
                let complete = false
                const newDate = game.gameDate + ' 19:00:00'
                newGame.gameDate = Timestamp.fromDate(new Date(newDate))

                if (newGame.gameDate < lastCompletedDtTm) {
                  complete = true
                }

                newGame.txtDate = game.gameDate
                if (game.type) {
                  newGame.type = game.type
                } else {
                  newGame.type = 'MTT'
                }
                if (game.structure) {
                  newGame.structure = game.structure
                } else {
                  newGame.structure = 'Freezeout'
                }
                newGame.buyIn = game.buyIn
                newGame.rebuy = game.rebuy
                newGame.addon = game.addon
                newGame.notes = game.notes
                newGame.complete = complete

                await this.addNewLeagueDate(newGame)
              }
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
        } else {
          showMessage('No dates found in that file')
        }
        this.dates = false
      }
      reader.readAsText(files.item(0))
    },
    async addNewLeagueDate (newDate) {
      const collection = 'gameDates'
      try {
        return await this.addObjectToFS(newDate, collection)
      } catch (err) {
        return err
      }
    },
    // Add document to collection passed from function
    async addObjectToFS (object, collectionName) {
      // Add scores by hole to FireStore daily scorecard collection
      const collection = firebaseStore.collection(collectionName)
      return collection.add(Object.assign({}, object))
    },
    async lookupPlayerByEmail (email) {
      const snapShot = await firebaseStore.collection('players')
        .where('email', '==', email)
        .get()
      if (snapShot.docs.length > 0) {
        const playerID = snapShot.docs[0].id
        return playerID
      } else {
        return null
      }
    }

  },
  async created () {
    await this.fbLeagueInfo()
  }

}
</script>
