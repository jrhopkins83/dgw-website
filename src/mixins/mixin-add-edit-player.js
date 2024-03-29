import { firebaseStore, firebaseFunctions } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
import { mapActions } from 'vuex'

export const mixinAddEditPlayer = {
  data () {
    return {
      mode: '',
      player: null,
      id: '',
      showEditPlayer: false,
      confirm: false,
      dialogHeader: '',
      dialogMsg: ''

    }
  },

  methods: {
    ...mapActions('auth', ['sendReset']),
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
    async savePlayer (player) {
      const playerNames = {
        firstName: player.firstName,
        lastName: player.lastName,
        nickName: player.nickName,
        onlineName: player.onlineName,
        avatar: player.avatar,
        photo: player.photo
      }

      const playerContactInfo = {
        email: player.email,
        phoneNumber: player.phoneNumber,
        emailOptin: player.emailOptin,
        notificationOptin: player.notificationOptin
      }

      if (this.editMode === 'edit') {
        const playerRef = firebaseStore.collection('players').doc(player.playerID)
        await playerRef.update(playerNames)
        if (player.createUser) {
          const newUserID = await this.createNewUser(playerContactInfo.email, 'dgwpassword')
          if (newUserID) {
            const userRef = {
              playerID: player.playerID,
              uid: newUserID
            }
            await this.createUserPlayerRef(userRef)
            const request = {
              email: playerContactInfo.email,
              requester: 'admin'
            }
            this.sendReset(request)
          }
        }
        const subscriberRef = firebaseStore.collection('subscribers').doc(player.playerID)
        return await subscriberRef.update(playerContactInfo)
      } else {
        const playerID = await this.addNewPlayer(playerNames)
        if (playerID) {
          playerContactInfo.playerID = playerID
          playerContactInfo.emailOptin = true
          await this.createSubscriber(playerContactInfo)
          if (playerContactInfo.email) {
            const newUserID = await this.createNewUser(playerContactInfo.email, 'dgwpassword')
            if (newUserID) {
              const userRef = {
                playerID: playerID,
                uid: newUserID
              }
              await this.createUserPlayerRef(userRef)
              await this.setUserClaim(newUserID, playerID)
              const request = {
                email: playerContactInfo.email,
                requester: 'admin'
              }
              this.sendReset(request)
              return playerID
            } else {
              return new Error(`Problem creating user ID for ${player.firstName} ${player.lastName}`)
            }
          } else {
            return playerID
          }
        } else {
          return new Error('New player not created')
        }
      }
    },
    async addNewPlayer (playerNames) {
      // First check if player already in database
      // If not, first add to players FS collection, then add to local storage
      const playerExists = await this.checkPlayerExists(playerNames)
      if (playerExists) {
        showMessage('error', 'A person with that name already exists')
        return false
      } else {
        // TO-DO: Manage duplicates through FS rules
        // Delete contact info
        const docRef = await this.addPlayerFS(playerNames)
        return docRef.id
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
    async editPlayer (playerNames, playerContactInfo) {
      const playerRef = firebaseStore.collection('players').doc(this.player.playerID)
      await playerRef.update(playerNames)
      const userRef = firebaseStore.collection('subscribers').doc(this.player.playerID)
      return await userRef.update(playerContactInfo)
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
    async setUserClaim (newUserID, playerID) {
      const setPlayerClaim = firebaseFunctions.httpsCallable('setPlayerClaim')
      setPlayerClaim({ uid: newUserID, playerID: playerID }).then(result => {
        const msg = result.data.message
        console.log(msg)
        return playerID
      })
    },
    async createUserPlayerRef (user) {
      try {
        firebaseStore
          .collection('users')
          .doc(user.uid)
          .set({
            playerID: user.playerID
          }).then(() => {
            return user.playerID
          })
      } catch (error) {
        showMessage('error', `Error adding user/player relationship: ${error.message}`)
        return error
      }
    },
    async createSubscriber (user) {
      try {
        console.log(user)
        return await firebaseStore
          .collection('subscribers')
          .doc(user.playerID)
          .set({
            email: user.email,
            phoneNumber: user.phoneNumber,
            emailOptin: user.emailOptin,
            notificationOptin: user.notificationOptin
          })
      } catch (error) {
        showMessage('error', `Error adding subscriber information: ${error.message}`)
        return error
      }
    },
    async deletePlayerDocs (playerID) {
      try {
        const promises = []
        // Delete player document
        const playersRef = firebaseStore.collection('players')
        promises.push(playersRef.doc(playerID).delete())
        // Delete player document
        const subscriberRef = firebaseStore.collection('subscribers')
        promises.push(subscriberRef.doc(playerID).delete())
        // Delete player season standings document
        const seasonRef = firebaseStore.collection('seasonStandings')
        promises.push(seasonRef.doc(playerID).delete())

        // Delete player weekly results documents
        const weeklyRef = firebaseStore.collection('weeklyResults')
        const weeklyResults = await weeklyRef
          .where('playerID', '==', playerID).get()
        weeklyResults.forEach(result => {
          const resultId = result.id
          return promises.push(weeklyRef.doc(resultId).delete())
        })

        // Delete player tournament results documents
        const tournamentRef = firebaseStore.collection('tournamentResults')
        const tournamentResults = await tournamentRef
          .where('playerID', '==', playerID).get()
        tournamentResults.forEach(result => {
          const resultId = result.id
          return promises.push(tournamentRef.doc(resultId).delete())
        })

        // Delete player user document
        const userRef = firebaseStore.collection('users')
        const userDocs = await userRef
          .where('playerID', '==', playerID).get()
        userDocs.forEach(user => {
          const userId = user.id
          return promises.push(userRef.doc(userId).delete())
        })
        // TO-DO: Delete userID
        return await Promise.all(promises)
      } catch (error) {
        switch (error) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Player not found in database')
            break
          default:
            showMessage('error', `Error deleting player: ${error.message}`)
        }
      }
    }
  }
}
