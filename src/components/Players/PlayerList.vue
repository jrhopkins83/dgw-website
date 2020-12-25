<template>
  <div>
    <section class='players-section'>
      <div class='players-section__players q-mb-sm' :class="isAdmin">
        <ol class='collection collection-container player-table q-mb-sm' :class="isAdmin">
          <!-- The first list item is the header of the table -->
          <li class='item item-container player-table__heading-row q-pb-sm' :class="isAdmin">
            <div class='attribute-container avatar'>
              <div class='attribute player-img'></div>
            </div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class='attribute-container player-information'>
              <div class='attribute-container player-names'>
                <div class='attribute firstName q-ml-sm'>First Name</div>
                <div class='attribute lastName'>Last Name</div>
                <div class='attribute nick-name gt-xs'>Nickname</div>
                <div class='attribute online-name'>Online Name</div>
              </div>
            </div>
            <div class='attribute-container contact-info' v-if="adminButtons">
              <div class='attribute email q-ml-sm'>eMail</div>
              <div class='attribute phone gt-xs'>Phone</div>
            </div>
              <div class="attribute-container admin-buttons text-center" v-if="adminButtons" >
                <div class="attribute edit">Actions</div>
              </div>
          </li>
          <player-row
            v-for='(player, playerID) in playerList'
            :key='playerID'
            :player='player'
            :id='player.playerID'
            :isAdmin="isAdmin"
            :adminButtons="adminButtons"
          >
          </player-row>
        </ol>
      </div>
    </section>
    <q-dialog
      v-model="showEditPlayer"
    >
      <edit-player-details
        :player="player"
        :mode="mode"
        @save="savePlayer"
        @close="showEditPlayer=false"
      />
    </q-dialog>
    <q-dialog
      v-model="confirm"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h3">
            {{ dialogHeader}}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ dialogMsg }}
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="deletePlayer"
            color="blue-10"
            label="Confirm"
          />
          <q-btn
            v-close-popup
            color="negative"
            label="Cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { firebaseStore } from 'src/boot/firebase'
import { toTitleCase, showMessage } from 'src/functions/functions-common'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'

export default {
  name: 'PlayerList',
  components: {
    playerRow: require('components/Players/Player.vue').default
  },
  mixins: [mixinAddEditPlayer],
  props: [
    'playerList',
    'isAdmin',
    'adminButtons'
  ],
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
  computed: {
    heading: function () {
      return `${toTitleCase(this.mode)} Player`
    }
  },
  methods: {
    addPlayer () {
      this.mode = 'add'
      this.showEditPlayer = true
    },
    editPlayer (value) {
      this.mode = 'edit'
      this.player = value[0]
      this.id = value[1]
      this.showEditPlayer = true
    },
    confirmDelete (value) {
      this.player = value[0]
      this.dialogHeader = 'Confirm Delete?'
      this.dialogMsg = 'Are you sure you want to delete this player?'
      this.confirm = true
    },
    async deletePlayer (value) {
      this.player = value[0]
      this.id = value[1]
      this.setPlayersLoaded(false)
      this.$q.loading.show({
        message: '<b>Player Deletion</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      try {
        const playersRef = firebaseStore.collection('players')
        await playersRef.doc(this.id).delete()
        this.setPlayersLoaded(true)
        this.player = {}
        this.showViewPlayer = false
        this.$q.loading.hide()
      } catch (err) {
        switch (err) {
          case 'permission-denied':
            showMessage('error', "You don't have access to add data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error deleting player: ' + err)
        }
      }
    },
    async savePlayer (player) {
      this.setPlayersLoaded(false)
      const playerNames = {
        firstName: player.firstName,
        lastName: player.lastName,
        nickName: player.nickName,
        onlineName: player.onlineName
      }
      const playerRef = firebaseStore.collection('players').doc(this.userInfo.playerID)
      await playerRef.update(playerNames)

      const playerContactInfo = {
        email: player.email,
        phoneNumber: player.phoneNumber,
        emailOptin: player.emailOptin,
        notificationOptin: player.notificationOptin
      }
      const userRef = firebaseStore.collection('subscribers').doc(this.userInfo.playerID)
      await userRef.update(playerContactInfo)

      this.$q.loading.hide()
      showMessage('Success', 'Player updated')
    }
  }
}
</script>

<style lang="scss" scoped>
  .players-section {
    position: relative;
    height: 70vh;
    overflow: hidden;

    ol.collection {
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;

      li {
        list-style: none;
      }

      .item-container.isAdmin {
          display: grid;
          grid-template-columns: 5em 3fr 2fr 9rem;
          grid-gap: 4px;

      }

      .item-container.isNotAdmin {
          display: grid;
          grid-template-columns: 5em 1fr;

      }

      .attribute-container {
        display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

          .attribute {
            display: flex;
            align-self: end;
          }
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 6.2em;
      }

      .contact-info {
          --column-width-min: 5.2em;
      }

      .admin-buttons {
          --column-width-min: 2em;
      }

      // .rank, .player, .points, .games, .average, .winnings {
      //   display: flex;
      //   align-self: end;
      // }

      /* Center header labels */
      .collection-container > .item-container:first-child .attribute {
        display: flex;
        align-items:flex-end;
        justify-content: center;
        text-overflow: initial;
        overflow: auto;
        white-space: normal;
        font-weight: bold;
      }

      .collection-container > .item-container:first-child .player-names .attribute {
        justify-content: flex-start;
      }

    }

    * {
      box-sizing: border-box;
    }

    &__players {
      // background-color: white;
      position: relative;
      height: 70vh;
      max-width: 60rem;
      overflow: scroll;
      border-radius: 2.5rem;
      opacity: .9;

      .player-table {
        position: relative;
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;

        &__heading-row {
          position: sticky;
          top: 0;
          z-index: 1;
          height: 5rem;
          align-items:flex-end;
          justify-content: center;
          align-self: center;
          text-overflow: initial;
          white-space: normal;
          color: black;
          background-color: $off-white;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

      }
    }

    &__players.isAdmin {
      max-width: 110rem;
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .online-name-header {
    display: none;
  }
}

</style>
