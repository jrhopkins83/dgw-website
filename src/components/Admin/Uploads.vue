<template>
  <div class="q-pa-xs" style="max-width: 400px" v-if="true">
    <q-card class="my-card" v-if="devMode">
      <q-card-section class="q-pa-xs">
        <div class="text-subtitle1 text-weight-bold text-center">Bulk Uploads</div>
      </q-card-section>

      <q-separator />

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload dates" @click="dates=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="dates">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="dateFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="uploadDates" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload League Info" @click="league=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="league">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="leagueFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="leagueUpload" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload Game Templates" @click="templates=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="templates">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="templateFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="templateUpload" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload Points" @click="points=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="points">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="pointsFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="pointsUpload" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload Players" @click="players=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="players">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="playerFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="bulkUpload" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
          </q-inner-loading>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-md">
          <q-card class="my-card">
            <q-card-actions class="q-mb-xs justify-evenly" align="center">
              <q-btn color="blue-6" label="Upload Standings" @click="standings=true" />
            </q-card-actions>
          </q-card>
          <q-dialog v-model="standings">
            <q-card style="width: 300px; max-width: 80vw;">
              <q-card-section>
                <input type="file" id="standingsFile" value="Import" />
              </q-card-section>
              <q-card-actions align="right" class="bg-white text-teal">
                <q-btn label="Cancel" color="negative" v-close-popup />
                <q-btn label="Upload" color="blue-9" @click="uploadStandings" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-inner-loading :showing="updating">
            <q-spinner-gears size="50px" color="blue-9" />
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
  components: {},
  mixins: [mixinAddEditPlayer],
  data () {
    return {
      league: false,
      templates: false,
      points: false,
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
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded']),
    devMode: function () {
      let devMode = true
      if (process.env.ENV_TYPE === 'Running Production') {
        devMode = false
      }
      return devMode
    }
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

      reader.onload = async (e) => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          // this.gameDates = await this.getLeagueDates()
          // if (this.gameDates.length) {
          results.forEach(async (player) => {
            try {
              this.editMode = 'add'
              let nickName = null
              let onlineName = null
              if (player.nickName.length > 0) {
                nickName = player.nickName.trim()
              }

              if (player.onlineName) {
                onlineName = player.onlineName.trim()
              }

              const playerAvatar = {
                avatarUrl: player.avatarUrl,
                avatarName: `${player.firstName}_${player.lastName}.png`
              }

              const playerPhoto = {
                photoUrl: player.photoUrl,
                photoName: `${player.firstName}_${player.lastName}.png`
              }
              const newPlayer = {
                playerID: player.playerID,
                avatar: playerAvatar,
                avatarChanged: true,
                photo: playerPhoto,
                photoChanged: true,
                firstName: toTitleCase(player.firstName).trim(),
                lastName: toTitleCase(player.lastName).trim(),
                email: player.email,
                phoneNumber: player.phoneNumber,
                nickName: nickName,
                onlineName: onlineName,
                emailOptin: true,
                createUser: true
              }

              const playerNames = {
                firstName: newPlayer.firstName,
                lastName: newPlayer.lastName,
                nickName: newPlayer.nickName,
                onlineName: newPlayer.onlineName,
                avatar: newPlayer.avatar,
                photo: newPlayer.photo
              }

              const playerContactInfo = {
                email: newPlayer.email,
                phoneNumber: newPlayer.phoneNumber,
                emailOptin: newPlayer.emailOptin,
                notificationOptin: newPlayer.notificationOptin
              }

              const playerID = await this.addNewPlayer(playerNames)
              if (playerID) {
                playerContactInfo.playerID = playerID
                await this.createSubscriber(playerContactInfo)
                player.playerID = playerID
                // await this.uploadWeeklyResults(player)
                if (playerContactInfo.email) {
                  const newUserID = await this.createNewUser(
                    playerContactInfo.email,
                    'dgwpassword'
                  )
                  if (newUserID) {
                    const userRef = {
                      playerID: playerID,
                      uid: newUserID
                    }
                    await this.createUserPlayerRef(userRef)
                    return this.setUserClaim(newUserID, playerID)
                  } else {
                    return new Error(
                      `Problem creating user ID for ${player.firstName} ${player.lastName}`
                    )
                  }
                } else {
                  return new Error('New player not created')
                }
              }
              if (playerID) {
              }
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
          // }
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
          const promises = []
          dateKeys.forEach(async (key) => {
            const keyDate = key + ' 19:00:00'
            const keyDtTime = Timestamp.fromDate(new Date(keyDate))
            if (keyDtTime.seconds && player[key] > 0) {
              // Get date ID from date key
              const index = this.gameDates.findIndex(
                (item) => item.txtDate === key
              )
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
                    const index = pointsAssignments.findIndex(
                      (item) => item.points === player[key]
                    )
                    position = pointsAssignments[index].position
                    const totalIndex = position - 1
                    playerTotals.places[totalIndex] =
                      playerTotals.places[totalIndex] + 1
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
                promises.push(
                  firebaseStore.collection('weeklyResults').add(newResult)
                )
              }
            }
            await Promise.all(promises)
            return await this.createPlayerStanding(player, playerTotals)
          })
        }
      } catch (error) {
        console.log(`Error adding weekly results: ${error.message}`)
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
        return await seasonStandings.doc(playerID).set(newStanding)
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

      reader.onload = (e) => {
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
                newPlayer.winnings = 0.0
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
        const pointAssignmentRef = firebaseStore
          .collection('leagueInfo')
          .doc('1')
          .collection('pointsAssignments')
          .orderBy('position')
        const pointsSnap = await pointAssignmentRef.get()

        if (!pointsSnap.empty) {
          const pointsAssignments = []
          pointsSnap.forEach((doc) => {
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
        const gameDatesRef = firebaseStore
          .collection('gameDates')
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
    async leagueUpload () {
      // Upload JSON formatted file with players
      const files = document.getElementById('leagueFile').files
      if (!files.length) {
        showMessage('No info found in that file')
        return false
      }
      const reader = new FileReader()

      reader.onload = async (e) => {
        const league = JSON.parse(e.target.result)
        if (league) {
          try {
            const newLeague = {
              bank: league.bank,
              currentSeason: league.currentSeason,
              helpText: league.helpText,
              finalTablePlayers: league.finalTablePlayers,
              leagueName: league.leagueName,
              leagueShortName: league.leagueShortName,
              messageLimit: league.messageLimit,
              pokerBrosInfo: league.pokerBrosInfo,
              tournamentStructures: league.tournamentStructures,
              tournamentTypes: league.tournamentTypes,
              zoomInfo: league.zoomInfo
            }
            await this.addNewLeague(newLeague)
          } catch (error) {
            console.error('Error adding document: ', error)
          }
        } else {
          showMessage('No info found in that file')
        }
        this.dates = false
      }
      reader.readAsText(files.item(0))
    },
    async addNewLeague (league) {
      try {
        const leagueID = await firebaseStore.collection('leagueInfo')
          .doc('1').set(league)
        return leagueID
      } catch (error) {
        return new Error(error)
      }
    },
    async templateUpload () {
      // Upload JSON formatted file with players
      const files = document.getElementById('templateFile').files
      if (!files.length) {
        showMessage('No templates found in that file')
        return false
      }
      const reader = new FileReader()

      reader.onload = (e) => {
        const results = JSON.parse(e.target.result)
        if (results.length) {
          results.forEach(async (template) => {
            try {
              const newTemplate = {
                defaults: template.defaults,
                seasonTournament: template.seasonTournament,
                structure: template.structure,
                template: template.template,
                type: template.type
              }
              const templateID = template.id.toString()
              await this.addLeagueTemplate(templateID, newTemplate)
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
        } else {
          showMessage('No templates found in that file')
        }
        this.dates = false
      }
      reader.readAsText(files.item(0))
    },
    async pointsUpload () {
      // Upload JSON formatted file with players
      const files = document.getElementById('pointsFile').files
      if (!files.length) {
        showMessage('No points found in that file')
        return false
      }
      const reader = new FileReader()

      reader.onload = (e) => {
        const results = JSON.parse(e.target.result)
        if (results.length) {
          results.forEach(async (position) => {
            try {
              const newPosition = {
                position: position.position,
                points: position.points
              }
              const docId = position.docId.toString()
              await this.addPointsAssignment(docId, newPosition)
            } catch (error) {
              console.error('Error adding document: ', error)
            }
          })
        } else {
          showMessage('No points found in that file')
        }
        this.dates = false
      }
      reader.readAsText(files.item(0))
    },
    async addLeagueTemplate (id, template) {
      try {
        const templatesRef = firebaseStore
          .collection('leagueInfo')
          .doc('1')
          .collection('gameTemplates')
          .doc(id)
        return await templatesRef.set(template)
      } catch (error) {
        return error
      }
    },
    async addPointsAssignment (id, doc) {
      try {
        const templatesRef = firebaseStore
          .collection('leagueInfo')
          .doc('1')
          .collection('pointsAssignments')
          .doc(id)
        return await templatesRef.set(doc)
      } catch (error) {
        return error
      }
    },
    async uploadDates () {
      // Upload JSON formatted file with players
      const files = document.getElementById('dateFile').files
      if (files.length) {
        showMessage('No dates found in that file')
        return false
      }
      const reader = new FileReader()

      reader.onload = (e) => {
        const results = JSON.parse(e.target.result)
        if (results.length > 0) {
          const newGame = {}
          const lastCompletedDate = '11/25/2020 19:00:00'
          const lastCompletedDtTm = Timestamp.fromDate(
            new Date(lastCompletedDate)
          )
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
      } catch (error) {
        return error
      }
    },
    // Add document to collection passed from function
    async addObjectToFS (object, collectionName) {
      // Add scores by hole to FireStore daily scorecard collection
      const collection = firebaseStore.collection(collectionName)
      return collection.add(Object.assign({}, object))
    },
    async lookupPlayerByEmail (email) {
      const snapShot = await firebaseStore
        .collection('players')
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
