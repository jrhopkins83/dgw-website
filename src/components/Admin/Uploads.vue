<template>
  <div
    class="q-pa-xs"
    style="max-width: 400px"
    v-if="leagueInfoLoaded"
  >
    <q-card class="my-card">
      <q-card-section class="q-pa-xs">
        <div class="text-subtitle1 text-weight-bold text-center">Bulk Uploads</div>
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
                label="Upload League Info"
                @click="league=true"
              />
            </q-card-actions>
          </q-card>
          <q-dialog
            v-model="league"
          >
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                This will upload the basic league information. Proceed?
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="No" color="negative" v-close-popup />
                <q-btn label="Yes" color="blue-9" @click="uploadLeagueInfo" />
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

      reader.onload = e => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          results.forEach(async (player) => {
            try {
              const newPlayer = {}
              newPlayer.firstName = toTitleCase(player.firstName).trim()
              newPlayer.lastName = toTitleCase(player.lastName).trim()
              newPlayer.nickName = player.nickName
              newPlayer.onlineName = player.onlineName
              newPlayer.phone = player.phone
              newPlayer.email = player.email
              newPlayer.avatar = player.avatar
              newPlayer.emailOptin = true
              newPlayer.notificationOptin = true
              player.playerID = await this.addNewPlayer(newPlayer)
              if (player.playerID) {
                const playerTotals = await this.uploadWeeklyResults(player)
                await this.createPlayerStanding(player, playerTotals)
                if (player.email) {
                  player.uid = await this.createNewUser(player.email)
                  if (player.uid) {
                    await this.createUserPlayerRef(player)
                  }
                }
              }
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
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
          // Get league dates
          const leagueDates = await this.getLeagueDates()
          if (leagueDates) {
            // for each date get points value
            const dateKeys = Object.keys(player)
            dateKeys.forEach(async (key) => {
              const keyDate = key + ' 19:00:00'
              const keyDtTime = Timestamp.fromDate(new Date(keyDate))
              if (keyDtTime.seconds && player[key] > 0) {
                // Get date ID from date key
                const index = leagueDates.findIndex(item => item.txtDate === key)
                if (index >= 0) {
                  const eventID = leagueDates[index].id
                  const eventDate = leagueDates[index].txtDate
                  // Lookup position based on points
                  let position = 0
                  const weekPoints = player[key]
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
                    }
                  }

                  // Add new document for the date
                  const newResult = {
                    playerID: player.playerID,
                    eventID: eventID,
                    date: eventDate,
                    position: position,
                    points: weekPoints,
                    prizeMoney: 0
                  }
                  await firebaseStore.collection('weeklyResults').add(newResult)
                }
              }
            })
          }
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
        const newStanding = {
          playerID: player.playerID,
          firstName: player.firstName,
          lastName: player.lastName,
          nickName: player.nickName,
          onlineName: player.onlineName,
          avatar: player.avatar,
          season: '2020',
          position: 0,
          totalPoints: player.points,
          games: player.games,
          pts_game: player.pts_game,
          total1st: playerTotals.places[0],
          total2nd: playerTotals.places[1],
          total3rd: playerTotals.places[2],
          total4th: playerTotals.places[3],
          finalTables: playerTotals.finalTables
        }
        return firebaseStore.collection('seasonStandings').add(newStanding)
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
                newPlayer.firstName = player.firstName
                newPlayer.lastName = player.lastName
                newPlayer.nickName = player.nickName
                newPlayer.onlineName = player.onlineName
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
        const leagueDatesRef = firebaseStore.collection('eventDates')
          .orderBy('date')
        const datesSnap = await leagueDatesRef.get()
        if (!datesSnap.empty) {
          const leagueDates = []
          datesSnap.forEach(async (doc) => {
            const leagueDate = {
              id: doc.id,
              txtDate: doc.data().txtDate,
              date: doc.data().date
            }
            leagueDates.push(leagueDate)
          })
          return leagueDates
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
        return false
      }
      const reader = new FileReader()

      reader.onload = e => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          const newEvent = {}
          results.forEach(async (event) => {
            try {
              const newDate = event.Date + ' 19:00:00'
              newEvent.date = Timestamp.fromDate(new Date(newDate))
              newEvent.txtDate = event.Date
              newEvent.type = 'MTT'
              newEvent.structure = 'Freezeout'
              newEvent.buyIn = 0
              newEvent.rebuy = 0
              newEvent.addon = 0

              await this.addNewLeagueDate(newEvent)
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
        }
        this.dates = false
      }
      reader.readAsText(files.item(0))
      // TO-DO Fix courseID
    },
    async addNewLeagueDate (newDate) {
      const collection = 'eventDates'
      try {
        return await this.addObjectToFS(newDate, collection)
      } catch (err) {
        return showMessage('Error', 'Error updating new date')
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
