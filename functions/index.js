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
    return admin.auth().setCustomUserClaims(user.uid, {
      isAdmin: true
    })
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an admin.`
    }
  }).catch(err => {
    return err
  })
})

exports.createUser = functions.https.onCall((data) => {
  return admin.auth().createUser(data)
    .catch((error) => {
      throw new functions.https.HttpsError('internal', error.message)
    })
})

// Tournament functions
exports.createTournamentResults = functions.https.onCall(async (event) => {

  // Only update seasono scores for weekly tournaments
  if (newEvent.type === 'MTT') {
    await createTournamentResults(event)
  } else {
    throw 'You can only create results for Multi-table tournaments'
  }
})

async function createTournamentResults (event) {
  try {
    const newEvent = event.data()
    newEvent.id = event.id

    const playersRef = admin.firestore().collection('players')

    // For each player add a new invite to invitations collection
    const snapshot = await playersRef.get()
    if (!snapshot.empty) {
      snapshot.forEach(async player => {
        const newPlayer = {
          date: newEvent.date,
          eventID: newEvent.id,
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
        const resultsRef = admin.firestore().collection('tournamentResults')
        const resultDoc = await resultsRef.add(newPlayer)
      })

    }
  } catch (error) {
    const updateCode = error.code
    const updatdeMessage = error.message
    const updateError = `Error creating invitations :  ${updateCode} -  ${updatdeMessage}`
    console.log(updateError)
    return new Error(error)
  }
}
// // function called when a new golfer is added
exports.newPlayer = functions.firestore.document('/players/{id}')
  .onCreate((snap, context) => {
    try {
      // Create a new document to track season scores
      const newStanding = {
        firstName: snap.data().firstName,
        lastName: snap.data().lastName,
        nickName: snap.data().nickName,
        onlineName: snap.data().onlineName,
        avatar: snap.data().avatar,
        season: '2020',
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
      return seasonStandings
        .doc(snap.id)
        .set(newStanding)
    } catch (error) {
      const updateCode = error.code
      const updatdeMessage = error.message
      const updateError = `Error updating new player to season standing :  ${updateCode} -  ${updatdeMessage}`
      console.log(updateError)
      throw new Error(error)
    }
  })

exports.weeklySummary = functions.firestore.document('/weeklyResults/{id}')
  .onCreate(async (snap, context) => {
    try {
      // Get the previous league date from leagueInfo

      const event = context.event
      const player = snap.data()
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
        const standingsUpdate = {
          playerID: player.playerID,
          firstName: player.firstName,
          lastName: player.lastName,
          nickName: player.nickName,
          onlineName: player.onlineName,
          avatar: player.avatar,
          season: '2020',
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
        const updateError = `Error updating season standings :  ${updateCode} -  ${updatdeMessage}`
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
  console.log('inside createSeasonScore playerID: ', playerID)
  console.log(totals)
  const seasonDocRef = admin.firestore().collection('seasonStandings').doc(playerID)
  seasonDocRef.doc(playerID).set(totals).catch((error) => {
    if (error.code !== 'unavailable') {
      console.error(`Fatal error ${error}`)
    }
    return Promise.reject(error)
  })
  // }
}

// Invitiaton functions
exports.eventUpdated = functions.firestore.document('/events/{id}')
  .onUpdate(async (change, context) => {
    const newEvent = change.after.data()
    newEvent.id = change.after.id
    const invitesSentRef = admin.firestore().collection('eventInvites').doc(newEvent.id)
    const event = await invitesSentRef.get()

    // If invites haven't been sent, create invite for all subscribed golfers
    if (!event.exists) {
      await createInvites(newEvent)
    } else {
      await updateInvites(newEvent)
    }
  })

async function createInvites (newEvent) {
  try {
    // Get players who are subscribed to invites
    const playersRef = admin.firestore().collection('players')
      .where('leagueID', '==', newEvent.leagueID)
      .where('emailOptIn', '==', true)

    // For each player add a new invite to invitations collection
    const snapshot = await playersRef.get()
    if (!snapshot.empty) {
      const subject = `You're invited - ${newEvent.name}`
      snapshot.forEach(async player => {
        const newInvite = {
          eventID: newEvent.id,
          subject: subject,
          playerID: player.id,
          firstName: player.data().firstName,
          lastName: player.data().lastName,
          email: player.data().primaryEmail,
          eventName: newEvent.name,
          eventHost: newEvent.host,
          contactPhone: newEvent.contactPhone,
          eventLocation: newEvent.location,
          eventAddress: newEvent.address,
          eventCity: newEvent.city,
          eventState: newEvent.state,
          eventZip: newEvent.zip,
          eventStartDate: newEvent.startDateTime,
          eventEndDate: newEvent.endDateTime,
          hostComments: newEvent.hostComments,
          response: null,
          numGuests: 0,
          guestNames: [],
          pairingRequest: '',
          comments: ''
        }
        const invitationsRef = admin.firestore().collection('invitations')
        const inviteDoc = await invitationsRef.add(newInvite)
        newInvite.id = inviteDoc.id
        sendInvite(newInvite)
      })

      const incrInvites = admin.firestore.FieldValue.increment(1)
      const docRef = admin.firestore().collection('eventInvites').doc(newEvent.id)

      return docRef.set({
        eventID: newEvent.id,
        invitesSent: incrInvites
      })
    }
  } catch (error) {
    const updateCode = error.code
    const updatdeMessage = error.message
    const updateError = `Error creating invitations :  ${updateCode} -  ${updatdeMessage}`
    console.log(updateError)
    return new Error(error)
  }
}
async function updateInvites (newEvent) {
  try {
    // Get players who are subscribed to invites
    const invitesRef = admin.firestore().collection('invitations')
      .where('eventID', '==', newEvent.id)

    // For each player add a new invite to invitations collection
    const snapshot = await invitesRef.get()
    if (!snapshot.empty) {
      const subject = `Reminder - ${newEvent.name}`
      snapshot.forEach(async invite => {
        const newInvite = {
          id: invite.id,
          subject: subject,
          eventName: newEvent.name,
          eventHost: newEvent.host,
          contactPhone: newEvent.contactPhone,
          eventLocation: newEvent.location,
          eventAddress: newEvent.address,
          eventCity: newEvent.city,
          eventState: newEvent.state,
          eventZip: newEvent.zip,
          eventStartDate: newEvent.startDateTime,
          eventEndDate: newEvent.endDateTime,
          hostComments: newEvent.hostComments,
          inviteSent: false
        }
        const invitationsRef = admin.firestore().collection('invitations').doc(newInvite.id)
        await invitationsRef.update(newInvite)
        sendInvite(newInvite)
      })

      const incrInvites = admin.firestore.FieldValue.increment(1)
      const docRef = admin.firestore().collection('eventInvites').doc(newEvent.id)

      return docRef.update({
        invitesSent: incrInvites
      })
    }
  } catch (error) {
    const updateCode = error.code
    const updatdeMessage = error.message
    const updateError = `Error updating invitations:  ${updateCode} -  ${updatdeMessage}`
    console.log(updateError)
    return new Error(error)
  }
}

