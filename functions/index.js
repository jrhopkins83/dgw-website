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

exports.addAdminRole = functions.https.onCall((data, context) => {
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

exports.eventCreated = functions.firestore.document('/eventDates/{id}')
  .onCreate(async (change, context) => {
    const newEvent = change.data()
    newEvent.id = change.id
    const invitesSentRef = admin.firestore().collection('eventInvites').doc(newEvent.id)
    const event = await invitesSentRef.get()

    // Only send invites for weekly tournaments
    if (newEvent.type === 'MTT') {
      await createTournamentResults(newEvent)
    }
  })

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

async function createTournamentResults (newEvent) {
  try {
    const playersRef = admin.firestore().collection('players')

    // For each player add a new invite to invitations collection
    const snapshot = await playersRef.get()
    if (!snapshot.empty) {
      const subject = `You're invited - ${newEvent.name}`
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

