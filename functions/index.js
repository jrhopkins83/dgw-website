const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const API_KEY = functions.config().sendgrid.key
const API_KEY = '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'
// const TEMPLATE_ID = functions.config().sendgrid.template
sgMail.setApiKey(API_KEY)
// console.log('API_KEY: ', API_KEY)
// console.log('TEMPLATE_ID: ', TEMPLATE_ID)

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
// Admin functions
exports.setAdminClaim = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  // if (context.auth.token.isAdmin !== true) {
  //   return {
  //     error: 'Only admins can add other admins'
  //   }
  // }
  // get user and add admin custom claim
  return admin.auth().getUserByEmail(data.email).then(user => {
    const claims = user.customClaims || {}
    claims.isAdmin = true
    claims.playerID = data.playerID
    return admin.auth().setCustomUserClaims(user.uid, claims)
  }).then(() => {
    return {
      message: `Success! ${data.email} $has been made an admin.`
    }
  }).catch(error => {
    return error
  })
})

exports.setPlayerClaim = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  if (context.auth.token.isAdmin !== true) {
    return {
      error: 'Only admins can add other admins'
    }
  }
  // get user and add admin custom claim
  return admin.auth().setCustomUserClaims(data.uid, {
    playerID: data.playerID
  }).then(() => {
    return {
      message: `Success! user ${data.uid}, player ${data.playerID} has been set.`
    }
  }).catch(error => {
    return error
  })
})

exports.createUser = functions.https.onCall((data, context) => {
  if (context.auth.token.isAdmin !== true) {
    return {
      error: 'Only admins can add other admins'
    }
  }
  return admin.auth().createUser(data)
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error.message)
    })
})

// function called when a new player is added
exports.newPlayer = functions.firestore.document('/players/{id}')
  .onCreate(async (snap, context) => {
    try {
      // Create a new document to track season scores
      const leagueDoc = await admin.firestore().collection('leagueInfo').doc('1').get()
      const leagueInfo = leagueDoc.data()
      const season = leagueInfo.currentSeason
      const newStanding = {
        season: season,
        position: 0,
        totalPoints: 0,
        games: 0,
        pts_game: 0,
        total1st: 0,
        total2nd: 0,
        total3rd: 0,
        total4th: 0,
        finalTables: 0
      }
      const seasonStandings = admin.firestore().collection('seasonStandings')
      return seasonStandings.doc(snap.id).set(newStanding)
    } catch (error) {
      const updateCode = error.code
      const updatdeMessage = error.message
      const updateError = `Error updating new player to season standing :  ${updateCode} -  ${updatdeMessage}`
      console.log(updateError)
      throw new Error(error)
    }
  })

// Update season scores when weekly result create completes
exports.weeklySummary = functions.firestore.document('/weeklyResults/{id}')
  .onCreate(async (snap, context) => {
    const event = context.event
    const player = snap.data()
    try {
      const places = [0, 0, 0, 0]
      const playerID = player.playerID
      if (player.finishedPosition <= 4) {
        places[player.finishedPosition - 1] = 1
      }
      let finalTables = 0
      if (player.finalTable) {
        finalTables = 1
      }
      const standingsDocRef = admin.firestore().collection('seasonStandings').doc(playerID)
      const doc = await standingsDocRef.get()
      if (doc.exists) {
        const standingsUpdate = {
          totalPoints: admin.firestore.FieldValue.increment(player.points),
          winnings: admin.firestore.FieldValue.increment(player.prizeMoney),
          games: admin.firestore.FieldValue.increment(1),
          total1st: admin.firestore.FieldValue.increment(places[0]),
          total2nd: admin.firestore.FieldValue.increment(places[1]),
          total3rd: admin.firestore.FieldValue.increment(places[2]),
          total4th: admin.firestore.FieldValue.increment(places[3]),
          finalTables: admin.firestore.FieldValue.increment(finalTables),
        }
        return await updateSeasonScore(event, playerID, standingsUpdate)
      } else {
        const places = []
        places[player.position] = 1
        const leagueDoc = await admin.firestore().collection('leagueInfo').doc('1').get()
        const leagueInfo = leagueDoc.data()
        const season = leagueInfo.currentSeason
        const standingsUpdate = {
          season: season,
          totalPoints: player.points,
          games: player.games,
          winnings: 0,
          pts_game: player.pts_game,
          total1st: player.places[0],
          total2nd: player.places[1],
          total3rd: player.places[2],
          total4th: player.places[3],
          finalTables: finalTables
        }
        return await createSeasonScore(standingsUpdate)
      }

    } catch (error) {
      if (error.code !== 'unavailable') {
        const updateCode = error.code
        const updatdeMessage = error.message
        const updateError = `Error updating season standings for player ${JSON.stringify(player)}:  ${updateCode} -  ${updatdeMessage}`
        console.log(updateError)
      }
    }
  })

function updateSeasonScore (event, playerID, totals) {
  // const eventAgeMs = Date.now() - Date.parse(event.timestamp)
  // const eventMaxAgeMs = 10000
  // if (eventAgeMs > eventMaxAgeMs) {
  //   console.log(`Dropping event ${event} with age[ms]: ${eventAgeMs}`)
  // } else {
  const standingsDocRef = admin.firestore().collection('seasonStandings').doc(playerID)
  standingsDocRef.update(totals).catch((error) => {
    if (error.code !== 'unavailable') {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  })
  // }
}

function createSeasonScore (event, playerID, totals) {
  // const eventAgeMs = Date.now() - Date.parse(event.timestamp)
  // const eventMaxAgeMs = 10000
  // if (eventAgeMs > eventMaxAgeMs) {
  //   console.log(`Dropping event ${event} with age[ms]: ${eventAgeMs}`)
  // } else {
  const seasonDocRef = admin.firestore().collection('seasonStandings').doc(playerID)
  seasonDocRef.doc(playerID).set(totals).catch((error) => {
    if (error.code !== 'unavailable') {
      console.error(`Fatal error ${error}`)
    }
    return Promise.reject(error)
  })
  // }
}

