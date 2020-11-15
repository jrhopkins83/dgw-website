import { firebaseStore, firebaseFunctions } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'

export const mixinAddEditPlayer = {
  methods: {
    async lookupLeagueCode (code) {
      const snapShot = await firebaseStore.collection('leagueAuthCodes')
        .where('authCode', '==', code)
        .get()
      if (snapShot.docs.length > 0) {
        const leagueID = snapShot.docs[0].data().leagueID
        return leagueID
      } else {
        return null
      }
    },

    async registerPlayer (newPlayer) {
      this.hideForm = true
      const newUser = {
        email: newPlayer.primaryEmail,
        password: newPlayer.password
      }
      this.setNewUser(true)
      const userID = await this.createUser(newUser)
      if (userID == null) {
        return
      }
      newUser.userID = userID
      // Add players to course players collection
      try {
        const existingPlayers = await this.checkPlayerExists(this.newUser)

        if (existingPlayers) {
          // Dialog to ask user if that's them
          let existingPlayer = {}
          // let players = [] TO-DO, figure out how to handle duplicate player names
          existingPlayers.forEach(doc => {
            existingPlayer = {
              playerID: doc.id,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName
            }
            // players.push(existingPlayer)
          })
          this.newUser.playerID = existingPlayer.playerID
          this.dialogMsg = `There's already someone registered with named
          ${existingPlayer.firstName}  ${existingPlayer.lastName}.  Is this you?`
          this.existingPrompt = true
        } else {
          const newPlayer = {
            leagueID: this.newUser.leagueID,
            firstName: this.newUser.firstName,
            lastName: this.newUser.lastName,
            fullHandicap: this.newUser.fullHandicap,
            primaryEmail: this.newUser.primaryEmail
          }
          this.registerNewPlayer(newPlayer)
        }
        this.hideForm = false
      } catch (error) {
        showMessage('error', `Error adding user: ,  ${error.message}`)
        this.hideForm = false
        return error
      }
    },
    async addNewPlayer (newPlayer) {
      // First check if player already in database
      // If not, first add to players FS collection, then add to local storage
      try {
        const playerExists = await this.checkPlayerExists(newPlayer)
        if (playerExists) {
          showMessage('error', 'A person with that name already exists')
          return false
        } else {
          try {
            // TO-DO: Manage duplicates through FS rules
            const docRef = await this.addPlayerFS(newPlayer)
            return docRef.id
          } catch (err) {
            showMessage('error', `Error adding player - ${err}`)
            return err
          }
        }
      } catch (err) {
        showMessage('error', `Error checking if player exists: ${err}`)
        return err
      }
    },
    async checkPlayerExists (player) {
      const snapShot = await firebaseStore.collection('players')
        .where('lastName', '==', player.lastName)
        .where('firstName', '==', player.firstName)
        .get()
      if (snapShot.docs.length > 0) {
        return snapShot.docs
      } else {
        return null
      }
    },
    async addPlayerFS (newPlayer) {
      var data = JSON.parse(JSON.stringify(newPlayer))
      return firebaseStore.collection('players').add(data)
    },
    async createNewUser (email, password) {
      // sign up the user
      try {
        const createUser = firebaseFunctions.httpsCallable('createUser')
        const newUser = await createUser({ email, password })
        return newUser.data.uid
      } catch (error) {
        var errorCode = error.code
        switch (errorCode) {
          case 'auth/email-already-in-use':
            this.message = 'That email is already registered.'
            break
          case 'auth/invalid-email':
            this.message = 'Please enter a valid e-mail address.'
            break
          case 'auth/weak-password':
            this.message = 'Passwords must be at least 6 characters long'
            break
          default:
            this.message = error.message
        }
        this.$emit('close')
        return false
      }
    },
    async registerExistingPlayer () {
      try {
        const docRef = firebaseStore.collection('players').doc(this.newUser.playerID)
        await docRef.update({
          primaryEmail: this.newUser.primaryEmail
        })
        const leagues = []
        leagues[0] = this.newUser.leagueID
        const newUser = {
          email: this.newUser.primaryEmail,
          playerID: this.newUser.playerID,
          userID: this.newUser.userID,
          fullHandicap: null,
          leagues: leagues
        }
        this.createUserPlayerRef(newUser)
      } catch (error) {
        showMessage('error', `Error updating existing player email: ${error.message}`)
      }
    },
    async registerNewPlayer (newPlayer) {
      const newDoc = await this.addPlayerFS(newPlayer)

      const newUser = {
        playerID: newDoc.id,
        userID: this.newUser.userID
      }
      this.createUserPlayerRef(newUser)
    },
    async createUserPlayerRef (user) {
      try {
        await firebaseStore
          .collection('users')
          .doc(user.userID)
          .set({
            playerID: user.playerID,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: false
          })
        return true
      } catch (error) {
        showMessage('error', `Error adding user/player relationship: ${error.message}`)
        return error
      }
    }
  }
}
