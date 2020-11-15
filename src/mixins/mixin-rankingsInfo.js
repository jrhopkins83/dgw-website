import {
  firebaseStore,
  firebaseFunctions,
  Timestamp
} from 'boot/firebase'
import { openDB } from 'idb'
import { showMessage, getNumber } from 'src/functions/functions-common'
import commonFunctions from 'src/mixins/mixin-common-functions'

export const scoreMixin = {
  mixins: [commonFunctions],
  data: function () {
    return {
      idbName: 'mgnIdb',
      db: null
    }
  },
  methods: {
    async openIDB () {
      this.db = await openDB(this.idbName, 1, {
        upgrade (db) {
          // Create a store for scorecards
          const store = db.createObjectStore('scoreCards', {
            keyPath: 'scoreID',
            autoIncrement: true
          })
          // Create indexes.
          store.createIndex('teeBox', 'teeBox', {
            unique: false,
            multiEntry: true
          })
          store.createIndex('hole', 'hole', {
            unique: false,
            multiEntry: true
          })
          store.createIndex('playerID', 'playerID', {
            unique: false,
            multiEntry: true
          })
        }
      })
      return this.db
    },
    // Function to get scorecards for a given player from indexedDb
    async loadPlayerScores () {
      const params = []
      params[0] = this.leagueID
      params[1] = this.courseID
      params[2] = this.RoundInfo.side
      params[3] = this.RoundInfo.teeBox
      params[4] = this.RoundInfo.groupID
      params[5] = this.RoundInfo.txtRoundDt
      if (this.RoundInfo.scoresLoaded) {
        // Check if any players have been added or deleted & call
        // functions to update databases if they have
        if (this.addedPlayerArr.length > 0) {
          try {
            await this.createDailyScores(params, this.addedPlayerArr)
            try {
              this.addedPlayerArr.forEach((golfer) => {
                this.deleteAddedPlayer({
                  id: golfer.playerID, golfer: golfer
                })
              })
              this.createScoreCardsIdb(params, this.holes, this.db).then(() => {
                this.changeHole()
              })
                .catch(error => {
                  showMessage('error', error.message)
                })
            } catch (error) {
              showMessage('error', `Error adding player scores: ${error.message}`)
              return
            }
          } catch (error) {
            showMessage('error', `Error adding player scorescards: ${error.message}`)
          }
        } else if (this.removedPlayerArr.length > 0) {
          try {
            await this.removePlayerScores(this.removedPlayerArr)
            this.changeHole()
          } catch (error) {
            showMessage('error', `Error removing player scores: ${error.message}`)
          }
        } else {
          this.changeHole()
        }
      } else {
        // Otherwise call functions load leader board documents to FS and scorecards to idb
        try {
          await this.createDailyScores(params, this.playerArr)
          try {
            this.createScoreCardsIdb(params, this.holes, this.db).then(() => {
              this.changeHole()
            })
          } catch (err) {
            showMessage('error', 'Error adding score card data: ' + err)
            return err
          }
        } catch (err) {
          showMessage('error', 'Error adding leader board data ' + err)
          return err
        }
        return null
      }
    },
    renderScoreCards (scoresArr) {
      let frontPar = 0,
        frontScore = 0,
        frontScoreToPar = 0,
        frontNetScore = 0,
        frontNetScoreToPar = 0,
        frontPutts = 0,
        backPar = 0,
        backScore = 0,
        backScoreToPar = 0,
        backNetScore = 0,
        backNetScoreToPar = 0,
        backPutts = 0

      const scorecardScores = []
      let holeScore = {}
      let scoreCardTotal = {}
      let totalPar = 0,
        cumScore = 0,
        cumScoreToPar = 0,
        cumNetScore = 0,
        cumNetScoreToPar = 0,
        cumPutts = 0,
        scoreClass = null,
        netScoreClass = null

      const numHolesToPlay = scoresArr.length

      Object.values(scoresArr).forEach((score) => {
        if (score.hole <= 9) {
          frontPar += score.holePar
          frontScore += score.grossScore
          frontScoreToPar += score.scoreToPar
          frontNetScore += score.netScore
          frontNetScoreToPar += score.netScoreToPar
          frontPutts += score.putts
        } else {
          backPar += score.holePar
          backScore += score.grossScore
          backScoreToPar += score.scoreToPar
          backNetScore += score.netScore
          backNetScoreToPar += score.netScoreToPar
          backPutts += score.putts
        }
        totalPar = totalPar + score.holePar
        cumScore = cumScore + score.grossScore
        cumScoreToPar = cumScoreToPar + score.scoreToPar
        cumNetScore = cumNetScore + score.netScore
        cumNetScoreToPar = cumNetScoreToPar + score.netScoreToPar
        cumPutts = cumPutts + score.putts
        // Set cell class based on score to par for background color
        if (score.scoreToPar != null) {
          switch (score.scoreToPar) {
            case 0:
              scoreClass = 'par'
              break
            case -1:
              scoreClass = 'birdie'
              break
            case -2:
            case -3:
              scoreClass = 'eagle'
              break
            case 1:
              scoreClass = 'bogie'
              break
            default:
              scoreClass = 'other'
              break
          }
        } else {
          scoreClass = null
        }
        if (score.netScoreToPar != null) {
          switch (score.netScoreToPar) {
            case 0:
              netScoreClass = 'par'
              break
            case -1:
              netScoreClass = 'birdie'
              break
            case -2:
            case -3:
              netScoreClass = 'eagle'
              break
            case 1:
              netScoreClass = 'bogie'
              break
            default:
              netScoreClass = 'other'
              break
          }
        } else {
          netScoreClass = null
        }
        holeScore = {
          leagueID: score.leagueID,
          courseID: score.courseID,
          playerID: score.playerID,
          roundDt: score.roundDt,
          groupID: score.groupID,
          courseHandicap: score.courseHandicap,
          cumScoreID: score.cumScoreID,
          teeBox: score.teeBox,
          firstName: score.firstName,
          lastName: score.lastName,
          hole: score.hole,
          holeHandicap: score.holeHandicap,
          holePar: score.holePar,
          grossScore: score.grossScore,
          scoreToPar: score.scoreToPar,
          scoreClass: scoreClass,
          netScoreClass: netScoreClass,
          cumScoreToPar: getNumber(cumScoreToPar),
          netScore: score.netScore,
          netScoreToPar: score.netScoreToPar,
          cumNetScoreToPar: getNumber(cumNetScoreToPar),
          putts: score.putts
        }

        scorecardScores.push(holeScore)

        if (numHolesToPlay === 18) {
          if (score.hole === 9) {
            holeScore = {
              leagueID: score.leagueID,
              courseID: score.courseID,
              playerID: score.playerID,
              roundDt: score.roundDt,
              groupID: score.groupID,
              cumScoreID: score.cumScoreID,
              teeBox: score.teeBox,
              firstName: score.firstName,
              lastName: score.lastName,
              hole: 'Out',
              holeHandicap: '',
              holePar: frontPar,
              grossScore: frontScore,
              scoreToPar: frontScoreToPar,
              scoreClass: 'total',
              netScoreClass: 'total',
              cumScoreToPar: getNumber(cumScoreToPar),
              netScore: frontNetScore,
              netScoreToPar: frontNetScoreToPar,
              cumNetScoreToPar: getNumber(cumNetScoreToPar),
              putts: frontPutts
            }
            scorecardScores.push(holeScore)
          }

          if (score.hole === 18) {
            holeScore = {
              leagueID: score.leagueID,
              courseID: score.courseID,
              playerID: score.playerID,
              roundDt: score.roundDt,
              groupID: score.groupID,
              cumScoreID: score.cumScoreID,
              teeBox: score.teeBox,
              firstName: score.firstName,
              lastName: score.lastName,
              hole: 'In',
              holeHandicap: '',
              holePar: backPar,
              grossScore: backScore,
              scoreToPar: backScoreToPar,
              scoreClass: 'total',
              netScoreClass: 'total',
              cumScoreToPar: getNumber(cumScoreToPar),
              netScore: backNetScore,
              netScoreToPar: backNetScoreToPar,
              cumNetScoreToPar: getNumber(cumNetScoreToPar),
              putts: backPutts
            }
            scorecardScores.push(holeScore)
          }
        }
      })
      const colLabel = 'Tot'
      scoreCardTotal = {
        cumScoreID: scorecardScores[0].cumScoreID,
        teeBox: scorecardScores[0].teeBox,
        courseHandicap: this.courseHandicap,
        colLabel: colLabel,
        totalPar: totalPar,
        cumScore: cumScore,
        cumScoreToPar: getNumber(cumScoreToPar),
        cumNetScore: cumNetScore,
        cumNetScoreToPar: getNumber(cumNetScoreToPar),
        cumPutts: cumPutts
      }
      this.setScorecardScores(scorecardScores)
      this.setScorecardTotals(scoreCardTotal)
      this.setScorecardsLoaded(true)
    },
    async createDailyScores (params, playerArr) {
      const promises = []
      const leagueID = params[0],
        courseID = params[1],
        side = params[2],
        teeBox = params[3],
        groupID = params[4],
        txtRoundDt = params[5],
        addedPlayer = true

      const pickDate = txtRoundDt + ' 12:00:00'
      const roundDt = Timestamp.fromDate(new Date(pickDate))
      for (const player of playerArr) {
        // First check if player exists in scores for date
        const results = await firebaseStore.collection('dailyScores')
          .where('groupID', '==', groupID)
          .where('playerID', '==', player.playerID)
          .get()

        if (results.empty) {
          // instantiate new cumScore for the player and call the function
          // to add it to the dailyScores FS collection
          const userID = this.UserInfo.userID

          const thruHole = 0,
            grossScore = 0,
            netScore = 0,
            scoreToPar = 0,
            netScoreToPar = 0

          let fullHandicap = 0
          let courseHandicap = 0
          if (player.fullHandicap) {
            fullHandicap = parseFloat(player.fullHandicap.toFixed(1))
            courseHandicap = parseFloat(player.courseHandicap.toFixed(1))
          }

          const newScore = {
            createdBy: userID,
            leagueID: leagueID,
            courseID: courseID,
            roundDt: roundDt,
            groupID: groupID,
            playerID: player.playerID,
            addedPlayer: addedPlayer,
            firstName: player.firstName,
            lastName: player.lastName,
            fullHandicap: fullHandicap,
            courseHandicap: courseHandicap,
            side: side,
            teeBox: teeBox,
            thruHole: thruHole,
            grossScore: grossScore,
            scoreToPar: scoreToPar,
            netScore: netScore,
            netScoreToPar: netScoreToPar,
            points: 0
          }
          promises.push(this.addObjectToFS(newScore, 'dailyScores'))
        }
      }
      return Promise.all(promises)
    },

    // Load hole scores for each player to scoreCards idb object store
    async createScoreCardsIdb (params, holes, db) {
      if (!('indexedDB' in window)) {
        showMessage('error', 'Your browser is not supported')
        return null
      }

      const leagueID = params[0],
        courseID = params[1],
        groupID = params[4],
        txtRoundDt = params[5]

      // const roundDt = Timestamp.fromDate(new Date(txtRoundDt))

      // First get player info from dailyScores collection
      const results = await firebaseStore.collection('dailyScores')
        .where('groupID', '==', groupID)
        .get()

      const tx = db.transaction('scoreCards', 'readwrite')
      const store = tx.objectStore('scoreCards')

      const newScoreCards = []
      // Loop through leaderboard players and add scorecard for each hole
      for (const doc of results.docs) {
        if (doc.data().addedPlayer === true) {
          for (const holeRow of holes) {
            const scoreSaved = false,
              cumScoreID = doc.id

            const newScore = {
              leagueID: leagueID,
              courseID,
              roundDt: txtRoundDt,
              groupID: doc.data().groupID,
              playerID: doc.data().playerID,
              cumScoreID,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              teeBox: doc.data().teeBox,
              hole: holeRow.hole,
              scoreSaved: scoreSaved,
              holeHandicap: holeRow.handicap,
              courseHandicap: doc.data().courseHandicap,
              holePar: holeRow.par,
              oldScore: null,
              oldNetScore: null,
              grossScore: null,
              scoreToPar: null,
              netScore: null,
              netScoreToPar: null,
              putts: null
            }
            newScoreCards.push(newScore)
          }
        }
      }
      return Promise.all(
        newScoreCards.map(function (scoreCard) {
          return store.add(scoreCard)
        })
      )
        .catch(function (e) {
          tx.abort()
          showMessage('error', e)
        })
    },

    async getScoreCardsFromIdb (currentHole) {
      const scoresArr = []

      const numHole = Number(currentHole)

      const storeName = 'scoreCards'
      const keyRng = IDBKeyRange.only(numHole)
      let cursor = await this.db
        .transaction(storeName)
        .store.index('hole')
        .openCursor(keyRng)

      while (cursor) {
        // instantiate new HoleScore
        const newScore = cursor.value
        if (!cursor.value.grossScore) {
          newScore.grossScore = cursor.value.holePar
        }
        if (!cursor.value.putts) {
          newScore.putts = 2
        }
        newScore.scoreID = cursor.primaryKey
        newScore.oldScore = cursor.value.grossScore
        newScore.oldNetScore = cursor.value.netScore
        scoresArr.push(newScore)
        cursor = await cursor.continue()
      }

      return scoresArr
    },

    async getScoreCardForPlayerIdb (playerID) {
      const scoresArr = []
      const db = await openDB(this.idbName)
      const storeName = 'scoreCards'
      const keyRng = IDBKeyRange.only(playerID)
      let cursor = await db
        .transaction(storeName)
        .store.index('playerID')
        .openCursor(keyRng)

      while (cursor) {
        scoresArr.push(cursor.value)
        cursor = await cursor.continue()
      }
      return scoresArr
    },

    // Save hole scores to dailyScorecard and dailyScores collections
    async saveHoleScores () {
      const scoreInputs = []
      // let success = true
      const that = this
      this.holeScores.forEach((score) => {
        const holePar = score.holePar
        // Use hole par if it wasn't updated
        if (!score.grossScore) {
          score.grossScore = holePar
        }
        // Use 2 putts if it wasn't updated
        if (!score.putts) {
          score.putts = 2
        }
        const netScores = this.calcNetScores(score)
        const player = that.players[score.playerID]
        let cumScore = 0
        const cumScoreToPar = player.cumScore
        if (score.scoreSaved === false) {
          const scoreToPar = netScores.scoreToPar
          cumScore = cumScoreToPar + scoreToPar
        } else {
          const scoreChange = score.grossScore - score.oldScore
          cumScore = cumScoreToPar + scoreChange
        }
        const payload = {
          id: score.playerID,
          cumScore: cumScore
        }
        this.updatePlayerTotal(payload)

        // instantiate new HoleScore
        const newScore = {
          scoreID: score.scoreID,
          cumScoreID: score.cumScoreID,
          playerID: score.playerID,
          scoreSaved: score.scoreSaved,
          grossScore: score.grossScore,
          netScore: netScores.netScore,
          hcpScore: netScores.hcpScore,
          scoreToPar: netScores.scoreToPar,
          netScoreToPar: netScores.netScoreToPar,
          points: netScores.points,
          putts: score.putts,
          oldScore: score.oldScore,
          oldNetScore: score.oldNetScore
        }

        scoreInputs.push(newScore)
      })
      return this.saveScoresToDB(this.RoundInfo.currentHole, scoreInputs)
    },
    // Update scorecard data and cumulative scores for hole
    // This version updates cumScore client side
    async saveScoresToDBOld (currentHole, scoreInputs) {
      const promises = []
      for (const scoreInput of scoreInputs) {
        // Call function to update hole score
        try {
          await this.updateScoreCardsIdb(scoreInput)
        } catch (err) {
          showMessage('error', 'error updating scorecards ' + err)
        }

        // Next update daily leaderboard if scores not previously saved
        if (scoreInput.scoreSaved === false) {
          const cumScoreID = scoreInput.cumScoreID

          // const incrHoles = firebaseStore.FieldValue.increment(1)
          // const incrScore = firebaseStore.FieldValue.increment(scoreInput.scoreToPar)

          // Until I figure out why Fielvalue.increment isn't working get cumScore then update
          var docRef = firebaseStore.collection('dailyScores').doc(cumScoreID)
          const doc = await docRef.get()
          if (doc.exists) {
            const scoreToPar = doc.data().scoreToPar
            const netScoreToPar = doc.data().netScoreToPar
            const thruHole = doc.data().thruHole
            const newscoreToPar = scoreToPar + scoreInput.scoreToPar
            const newNetScoreToPar = netScoreToPar + scoreInput.netScoreToPar
            const newThruHole = thruHole + 1
            promises.push(
              docRef.update({
                addedPlayer: false,
                thruHole: newThruHole,
                currentHole: currentHole,
                scoreToPar: newscoreToPar,
                netScoreToPar: newNetScoreToPar
              })
            )
            this.setNumHolesPlayed(newThruHole)
            if (newThruHole === this.RoundInfo.numHolesToPlay) {
              this.setLastHolePlayed(true)
            }
          } else {
            // doc.data() will be undefined in this case
            showMessage('error', 'Unable to get total score')
          }
        } else {
          if (scoreInput.grossScore !== scoreInput.oldScore) {
            const cumScoreID = scoreInput.cumScoreID
            const scoreChange = scoreInput.grossScore - scoreInput.oldScore
            const netScoreChange = scoreInput.netScore - scoreInput.oldNetScore
            // const incrScore = firebaseStore.FieldValue.increment(scoreChange)
            docRef = firebaseStore.collection('dailyScores').doc(cumScoreID)
            const doc = await docRef.get()
            if (doc.exists) {
              const scoreToPar = doc.data().scoreToPar
              const newScoreToPar = scoreToPar + scoreChange
              const netScoreToPar = doc.data().netScoreToPar
              const newNetScoreToPar = netScoreToPar + netScoreChange
              promises.push(
                docRef.update({
                  scoreToPar: newScoreToPar,
                  netScoreToPar: newNetScoreToPar
                })
              )
            } else {
              // doc.data() will be undefined in this case
              showMessage('error', 'Unable to get total score')
            }
          }
        }
      }
      return Promise.all(promises)
    },
    // Update scorecard data and cumulative scores for hole
    // This version updates cumScore server side via cloud function
    async saveScoresToDB (currentHole, scoreInputs) {
      for (const scoreInput of scoreInputs) {
        // Call function to update hole score
        try {
          await this.updateScoreCardsIdb(scoreInput)
        } catch (err) {
          showMessage('error', 'error updating scorecards ' + err)
        }

        // Next update daily leaderboard if scores not previously saved
        const cumScoreID = scoreInput.cumScoreID
        const updateCumScore = firebaseFunctions.httpsCallable('updateCumScore')
        if (scoreInput.scoreSaved === false) {
          const thruHole = this.RoundInfo.numHolesPlayed
          const newThruHole = thruHole + 1
          this.setNumHolesPlayed(newThruHole)
          if (newThruHole === this.RoundInfo.numHolesToPlay) {
            this.setLastHolePlayed(true)
          }
          const payload = {
            id: currentHole,
            value: true
          }
          this.setHolePlayed(payload)
          updateCumScore({
            cumScoreID: cumScoreID,
            addedPlayer: false,
            thruHole: 1,
            currentHole: currentHole,
            scoreToPar: scoreInput.scoreToPar,
            netScoreToPar: scoreInput.netScoreToPar
          })
            .catch(error => {
              showMessage(error.message)
            })
        } else {
          if (scoreInput.grossScore !== scoreInput.oldScore) {
            const cumScoreID = scoreInput.cumScoreID
            const scoreChange = scoreInput.grossScore - scoreInput.oldScore
            const netScoreChange = scoreInput.netScore - scoreInput.oldNetScore
            updateCumScore({
              cumScoreID: cumScoreID,
              addedPlayer: false,
              thruHole: 0,
              currentHole: currentHole,
              scoreToPar: scoreChange,
              netScoreToPar: netScoreChange
            })
              .catch(error => {
                showMessage(error.message)
              })
          }
        }
      }
    },

    async updateScoreCardsIdb (score) {
      var tx = this.db.transaction('scoreCards', 'readwrite')
      var store = tx.objectStore('scoreCards')

      const myRecord = await store.get(score.scoreID)
      myRecord.grossScore = score.grossScore
      myRecord.scoreToPar = score.scoreToPar
      myRecord.netScore = score.netScore
      myRecord.netScoreToPar = score.netScoreToPar
      myRecord.points = score.points
      myRecord.putts = score.putts
      myRecord.scoreSaved = true
      store.put(myRecord)
      return tx.done
    },

    async removePlayerScores (playerArr) {
      // Delete scores object store from IDB
      const storeName = 'scoreCards'
      const tx = this.db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      // Peform query to get scorecard document for player
      for (const player of playerArr) {
        // delete player score from idb scoreCards store
        const keyRng = IDBKeyRange.only(player.playerID)
        let cursor = await store.index('playerID').openCursor(keyRng)
        while (cursor) {
          await cursor.delete()
          cursor = await cursor.continue()
        }
        // Perform query to get scorecard documents for group
        const groupID = this.RoundInfo.groupID
        await firebaseStore
          .collection('dailyScores')
          .where('groupID', '==', groupID)
          .where('playerID', '==', player.playerID)
          .get()
          .then(function (querySnapshot) {
            // Once we get the results, begin a batch
            var batch = firebaseStore.batch()

            querySnapshot.forEach(function (doc) {
              // For each doc, add a delete operation to the batch
              batch.delete(doc.ref)
            })

            // Commit the batch
            return batch.commit()
          })
          .catch(err => {
            switch (err) {
              case 'permission-denied':
                showMessage('error', "You don't have access to that data.")
                break

              case 'not-found':
                showMessage('error', 'Record not found in database')
                break

              default:
                showMessage('error', 'Error getting data: ' + err)
            }
          })
      }
    },
    // Delete scorecards for players
    async clearScorecardsForPlayers (playerArr) {
      // Perform query to get scorecard document for player
      const storeName = 'scoreCards'
      const tx = this.db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)
      for (const player of playerArr) {
        const keyRng = IDBKeyRange.only(player.playerID)
        // delete player score from idb scoreCards store
        let cursor = await store.index('playerID').openCursor(keyRng)
        while (cursor) {
          await cursor.delete()
          cursor = await cursor.continue()
        }
      }
    },
    async saveScoresToFS (arrPlayers) {
      const holesPlayed = this.holesToPlay
      const promises = []

      for (const player of arrPlayers) {
        let totGrossScore = 0,
          totPutts = 0,
          totPar = 0,
          totPoints = 0,
          cumScoreID = ''

        const playerID = player.playerID
        const scoresArr = await this.getScoreCardForPlayerIdb(playerID)
        for (const score of scoresArr) {
          // Add to total gross score, putts & par
          totGrossScore += score.grossScore
          totPutts += score.putts
          totPar += score.holePar
          totPoints += score.points
          score.roundDt = Timestamp.fromDate(new Date(score.roundDt))
          const newScore = score
          promises.push(this.addObjectToFS(newScore, 'dailyScoreCard'))
        }

        // Calculate net score & handicap differential

        let netScore = null,
          scoreToPar = null,
          netScoreToPar = null,
          courseRating = null,
          hcpDifferential = null

        const playerHcp = player.courseHandicap
        const slope = this.RoundInfo.teeInfo.slope

        if (playerHcp == null || isNaN(playerHcp)) {
          netScore = totGrossScore
        } else {
          if (Object.keys(holesPlayed).length === 9) {
            netScore = Math.round(totGrossScore - (playerHcp / 2))
            courseRating = this.RoundInfo.teeInfo.rating / 2
          } else {
            netScore = totGrossScore - playerHcp
            courseRating = this.RoundInfo.teeInfo.rating
          }
        }
        scoreToPar = totGrossScore - totPar
        netScoreToPar = netScore - totPar
        const hcpDiffPt1 = (totGrossScore - courseRating)
        const hcpDiffPt2 = (113 / slope)
        hcpDifferential = (hcpDiffPt1 * hcpDiffPt2) * 2
        hcpDifferential = parseFloat(hcpDifferential.toFixed(1))

        // Next update daily scores

        cumScoreID = scoresArr[0].cumScoreID
        const docRef = firebaseStore.collection('dailyScores').doc(cumScoreID)
        promises.push(
          docRef.update({
            grossScore: totGrossScore,
            netScore: netScore,
            putts: totPutts,
            scoreToPar: scoreToPar,
            netScoreToPar: netScoreToPar,
            hcpDifferential: hcpDifferential,
            points: totPoints,
            thruHole: 'F'
          })
        )
      }
      return Promise.all(promises)
    },

    async updateScoresToFS (scoresArr, scoreCardTotals, LeagueInfo) {
      const promises = []

      let totGrossScore = 0,
        totPutts = 0,
        totPar = 0,
        totPoints = 0

      const cumScoreID = scoreCardTotals.cumScoreID

      for (const score of scoresArr) {
        // Add to total gross score, putts & par
        if (score.updated) {
          const netScores = this.calcNetScores(score)
          const docRef = firebaseStore.collection('dailyScoreCard').doc(score.scoreID)
          promises.push(
            docRef.update({
              grossScore: score.grossScore,
              scoreToPar: netScores.scoreToPar,
              netScore: netScores.netScore,
              netScoreToPar: netScores.netScoreToPar,
              putts: score.putts,
              points: netScores.points
            })
          )
          totPoints += netScores.points
        } else {
          totPoints += score.points
        }
        totGrossScore += score.grossScore
        totPutts += score.putts
        totPar += score.holePar
      }
      let netScore = 0

      const playerHcp = scoreCardTotals.courseHandicap

      if (playerHcp == null || isNaN(playerHcp)) {
        netScore = totGrossScore
      } else {
        if (scoresArr.length === 9) {
          netScore = Math.round(totGrossScore - (playerHcp / 2))
        } else {
          netScore = totGrossScore - playerHcp
        }
      }
      const totScoreToPar = totGrossScore - totPar
      const totnetScoreToPar = totScoreToPar - totPar

      // Next update daily scores

      const docRef = firebaseStore.collection('dailyScores').doc(cumScoreID)

      promises.push(
        docRef.update({
          grossScore: totGrossScore,
          netScore: netScore,
          putts: totPutts,
          cumScoreToPar: totScoreToPar,
          cumNetScoreToPar: totnetScoreToPar,
          points: totPoints
        })
      )

      // TO-DO update season score record
      return Promise.all(promises)
    },

    async getScoresFromFS (collectionName, params) {
      const scoresArr = []
      let key = Object.keys(params[0])
      let valueObj = Object.values(params[0])
      let field = key[0]
      let value = valueObj[0]

      const collection = await firebaseStore.collection(collectionName)
      let query = collection.where(field, '==', value)
      for (let i = 1; i < params.length; i++) {
        key = Object.keys(params[i])
        valueObj = Object.values(params[i])
        field = key[0]
        value = valueObj[0]
        query = query.where(field, '==', value)
      }
      const snapshot = await query.get()
      if (snapshot.empty) {
        showMessage('error', 'No scores found for selected date')
        return null
      } else {
        snapshot.forEach(doc => {
          scoresArr.push(doc.data())
        })

        return scoresArr
      }
    },

    async getScoreCardsFS (params) {
      const scoresArr = []
      let key = Object.keys(params[0])
      let valueObj = Object.values(params[0])
      let field = key[0]
      let value = valueObj[0]

      const collection = await firebaseStore.collection('dailyScoreCard')
      let query = collection.where(field, '==', value)
      for (let i = 1; i < params.length; i++) {
        key = Object.keys(params[i])
        valueObj = Object.values(params[i])
        field = key[0]
        value = valueObj[0]
        query = query.where(field, '==', value)
      }
      query = query.orderBy('hole', 'asc')
      const snapshot = await query.get()
      if (snapshot.empty) {
        showMessage('error', 'No scores found')
        return null
      } else {
        let newScore = {}
        snapshot.forEach(doc => {
          newScore = doc.data()
          newScore.id = doc.id
          scoresArr.push(newScore)
        })

        return scoresArr
      }
    },

    async updateScoreCardsFS (scoresArr) {
      const promises = []
      let scoreID = ''
      for (const score of scoresArr) {
        scoreID = score.scoreID
        var docRef = firebaseStore.collection('dailyScoreCard').doc(scoreID)

        promises.push(
          docRef.update({ score })
        )
      }
      return Promise.all(promises)
    },
    async clearScores () {
      // Delete scorecards from indexedDB database
      await this.clearScoreCardIDB('scoreCards')

      // Delete total scores from dailyScores FS collection
      const params = []
      params[0] = { groupID: this.RoundInfo.groupID }
      // Perform query to get scorecard documents for group
      try {
        await this.delDocsFromFS('dailyScores', params)
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to that data.")
            break

          case 'not-found':
            showMessage('error', 'Record not found in database')
            break

          default:
            showMessage('error', 'Error getting data: ' + err)
        }
      }
    }, // End function clearScores
    async clearData () {
      // Delete scorecards from indexedDB database, clear LS and return to home page
      const db = await this.openIDB()
      const tx = db.transaction('scoreCards', 'readwrite')
      const store = tx.objectStore('scoreCards')
      await store.clear()
      this.clearRoundInfo()
    },

    // Function to clear the scoreCards object store from indexedDb
    async clearScoreCardIDB (storeName) {
      // Delete scorecards from indexedDB database
      const db = await openDB(this.idbName)
      // Delete scorecards from indexedDB database
      var tx = db.transaction(storeName, 'readwrite')
      var store = tx.objectStore(storeName)
      return store.clear()
    },
    calcNetScores (score) {
      // Calculate net score based on course handicap and hole par
      let scoreAdj = 0,
        extraHoleAdj = 0,
        netScore = 0,
        hcpScore = 0,
        scoreToPar = 0,
        netScoreToPar = 0,
        points = 0

      if (score.courseHandicap >= score.holeHandicap) {
        scoreAdj = 1
      }
      if (score.courseHandicap > 18) {
        extraHoleAdj = score.courseHandicap - 18
      }
      if (extraHoleAdj >= score.holeHandicap) {
        scoreAdj = scoreAdj + 1
      }

      netScore = score.grossScore - scoreAdj

      // Maximum score for handicap calculation for 2020 is net double bogey
      if (score.courseHandicap) {
        const maxScore = score.holePar + 2 + scoreAdj
        if (netScore <= maxScore) {
          hcpScore = netScore
        } else {
          hcpScore = maxScore
        }
      } else {
        hcpScore = score.holePar + 5
      }
      scoreToPar = score.grossScore - score.holePar
      netScoreToPar = netScore - score.holePar

      switch (netScoreToPar) {
        case 5:
        case 4:
        case 3:
          points = this.LeagueInfo.points.other
          break
        case 2:
          points = this.LeagueInfo.points.double
          break
        case 1:
          points = this.LeagueInfo.points.bogie
          break
        case 0:
          points = this.LeagueInfo.points.par
          break
        case -1:
          points = this.LeagueInfo.points.birdie
          break
        case -2:
        case -3:
          points = this.LeagueInfo.points.eagle
          break
      }
      const netScores = {
        netScore: netScore,
        hcpScore: hcpScore,
        scoreToPar: scoreToPar,
        netScoreToPar: netScoreToPar,
        points: points
      }
      return netScores
    }

  }
}
