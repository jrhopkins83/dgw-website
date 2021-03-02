const functions = require('firebase-functions')
const admin = require('firebase-admin')
let webPush = require('web-push')
const functions = require('firebase-functions')
const firestore = require('@google-cloud/firestore')

const client = new firestore.v1.FirestoreAdminClient()

admin.initializeApp()

const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const API_KEY = functions.config().sendgrid.key
const API_KEY = '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'
// const TEMPLATE_ID = functions.config().sendgrid.template
sgMail.setApiKey(API_KEY)
// console.log('API_KEY: ', API_KEY)
// console.log('TEMPLATE_ID: ', TEMPLATE_ID)

/*
  config - webPush
*/

webPush.setVapidDetails(
  'mailto:jrhopkins83@gmail.com',
  'BD9d2d8NNm30iU4hzsKBRhpBD27wJo93TRtHbeHWYNPO9QjfSmSP579aP7hPiZZB1vTpwsQ6EsZ6Gkzh8YLlzk0', // public key
  'c3dii9ZWil5tWJg1HUBsVh7-BJ87Fh1G3j1ciADI49k' // private key
)

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
      error: 'Only admins can create users.'
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
        games: 0,
        totalPoints: 0,
        winnings: 0,
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
    if (player.seasonTournament) {
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
    }
    return true
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

// Sends a notification to all users when game results have been updated.
exports.sendNotifications = functions.firestore
  .document('gameDates/{gameId}')
  .onUpdate(async (change, context) => {
    const previousValue = change.before.data()
    const newValue = change.after.data()

    const oldComplete = previousValue.complete
    const newComplete = newValue.complete
    const gameDate = newValue.gameDate.toDate()
    const txtGameDate = gameDate.toLocaleDateString()

    // If game is MTT and complete now true but previously false, send notification to all users
    if (newValue.type === 'MTT' && newComplete && !oldComplete) {
      // Notification details.
      const url = '/weekly-results'
      // Get the list of device subscriptions (FCM tokens if using Firebase)
      const subscribers = await admin.firestore().collection('notifSubscribers').get()
      const pushSubscriptions = []
      let messagingType = ''
      subscribers.forEach((subscriptionDoc) => {
        const subscription = subscriptionDoc.data()
        subscription.pushSubscription.docId = subscriptionDoc.id

        pushSubscriptions.push(subscription.pushSubscription)
      })

      if (pushSubscriptions.length > 0) {
        // Send notifications to all subscriptions.
        let response = null
        try {
          const pushErrors = []
          pushSubscriptions.forEach(async subscription => {
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh
              }
            }
            let pushContent = {
              title: `DGW Game Results Updated`,
              body: `Results for ${txtGameDate} have been posted.  Click on the notification to view the updates.`,
              action: 'openUrl',
              openUrl: url
            }
            let pushContentStringified = JSON.stringify(pushContent)
            try {
              response = await webPush.sendNotification(pushSubscription, pushContentStringified)
            } catch (error) {
              console.log('sendNotification error response: ', error.statusCode)
              console.log('subscription doc id: ', subscription.docId)
              const statusCode = error.statusCode
              subscription.statusCode = statusCode
              console.log('sendNotification error, subscription: ', JSON.stringify(subscription))
              cleanupSubscriptions(subscription)
            }
          })

        } catch (error) {
          console.error('error sending message: ', error)
        }
      }
    }
  })

// Cleans up the subscriptions that are no longer valid.
async function cleanupSubscriptions (pushError) {
  try {
    // For each notification we check if there was an error.
    const statusCode = pushError.statusCode
    const docId = pushError.docId

    console.error('Failure sending notification to', docId, statusCode)
    // Cleanup the subscriptions who are not registered anymore.
    if (statusCode === 410) {
      return await admin.firestore().collection('notifSubscribers').doc(docId).delete()
    } else {
      return true
    }
  } catch (error) {
    console.error('Error cleaning up subscription: ', error, JSON.stringify(pushError))
  }
  return true
}

// Cleans up the web push subscriptions that are no longer valid.
function cleanupTokens (response, tokens) {
  // For each notification we check if there was an error.
  const tokensDelete = []
  response.results.forEach((result, index) => {
    const error = result.error
    if (error) {
      console.error('Failure sending notification to', tokens[index], error)
      // Cleanup the tokens who are not registered anymore.
      if (error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered') {
        const deleteTask = admin.firestore().collection('fcmTokens').doc(tokens[index]).delete()
        tokensDelete.push(deleteTask)
      }
    }
  })
  return Promise.all(tokensDelete)
}

// Backup functions
function backupFirestore () {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
  const databaseName = client.databasePath(projectId, '(default)')

  return client
    .exportDocuments({
      name: databaseName,
      // Add your bucket name here
      outputUriPrefix: 'gs://your-bucket-name',
      // Empty array == all collections
      collectionIds: []
    })
    .then(([response]) => {
      console.log(`Operation Name: ${response.name}`)
      return response
    })
    .catch(err => {
      console.error(err)
      throw new Error('Export operation failed')
    })
}

// Schedule the automated backup
functions.pubsub.schedule('every 24 hours').onRun(backupFirestore)
