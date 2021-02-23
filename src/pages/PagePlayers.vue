<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <div
        class="container player-section"
        v-if="playersLoaded"
      >
        <div class="player-section__title text-h3 text-bold">
          Donkey's Gone Wild Players
        </div>
        <div class="player-section__search-bar" :class="isAdmin">
          <search>
          </search>
        </div>
        <div class="player-section__list" :class="isAdmin">
          <player-list
            :playerList="playerList"
            :isAdmin="isAdmin"
            :adminButtons="adminButtons"
            @editPlayer="editPlayer"
            @deletePlayer="confirmDelete"
          >
          </player-list>
        </div>
        <div class="fixed-bottom text-center q-mb-lg no-pointer-events" v-if="adminButtons">
          <q-btn
            @click="addPlayer"
            round
            class="all-pointer-events"
            color="grey-6"
            size="20px"
            icon="add"
          />
        </div>

        <!-- edit player -->
        <q-dialog
          v-model="showEditPlayer"
        >
          <update-player-profile
            :player="player"
            @submit="savePlayer"
            @close="showEditPlayer=false"
          >
            Edit Player
          </update-player-profile>
        </q-dialog>

        <!-- confirm delete -->
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
    </transition>
  </q-page>
</template>

<script>
// import { firebaseStore } from 'src/boot/firebase'
import { mapGetters, mapActions } from 'vuex'
import { showMessage } from 'src/functions/functions-common'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'

export default {
  name: 'PagePlayers',
  components: {
    playerList: require('components/Players/PlayerList.vue').default,
    updatePlayerProfile: require('components/Players/Modals/updatePlayerProfile.vue.vue').default,
    search: require('components/Players/Search.vue').default
  },
  mixins: [mixinAddEditPlayer],
  props: {
    mode: {
      type: String,
      default: 'view'
    }
  },
  data () {
    return {
      showEditPlayer: false,
      editMode: '',
      id: '',
      player: {}
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo']),
    ...mapGetters('players', ['playersLoaded', 'players', 'subscribers', 'playersFiltered']),
    isAdmin: function () {
      if (this.userInfo.isAdmin && this.mode === 'edit') {
        return 'isAdmin'
      } else {
        return 'isNotAdmin'
      }
    },
    adminButtons: function () {
      if (this.userInfo.isAdmin && this.mode === 'edit') {
        return true
      } else {
        return false
      }
    },
    playerList: function () {
      const players = Object.values(this.playersFiltered)
      const subscribers = this.subscribers

      if (this.userInfo.isAdmin && this.playersLoaded && players.length && subscribers.length) {
        const playersMerged = players.map(player => ({
          ...subscribers.find((subscriber) => (subscriber.id === player.id) && subscriber),
          ...player
        }))
        return playersMerged
      } else {
        return players
      }
    }
  },
  methods: {
    ...mapActions('players', ['setPlayersLoaded', 'fbPlayers', 'setSearch']),
    ...mapActions('players', ['setPlayersLoaded']),
    async loadPlayers () {
      try {
        await this.fbPlayers()
      } catch (error) {
        switch (error) {
          case 'permission-denied':
            showMessage('error', "You don't have access to players data.")
            break
          case 'not-found':
            showMessage('error', 'Record not found in database')
            break
          default:
            showMessage('error', 'Error getting players: ' + error)
        }
        this.setResultsLoaded(true)
      }
    },
    addPlayer () {
      this.editMode = 'add'
      this.showEditPlayer = true
    },
    editPlayer (value) {
      this.player = value[0]
      this.id = value[1]
      this.editMode = value[2]
      this.showEditPlayer = true
    },
    confirmDelete (value) {
      this.player = value[0]
      this.dialogHeader = 'Confirm Delete?'
      this.dialogMsg = `This will also delete all results for ${this.player.firstName} ${this.player.lastName}. Are you sure you want to delete?`
      this.confirm = true
    },
    async deletePlayer (value) {
      this.setPlayersLoaded(false)
      this.$q.loading.show({
        message: '<b>Player Deletion</b> is in progress.<br/><span class="text-info">Hang on...</span>'
      })
      await this.deletePlayerDocs(this.player.playerID)
      this.setPlayersLoaded(true)
      this.player = {}
      this.confirm = false
      this.$q.loading.hide()
    },
    async savePlayer (player) {
      this.setPlayersLoaded(false)
      this.$q.loading.show({
        message: `<b>Player ${this.editMode}</b> is in progress.<br/><span class="text-info">Hang on...</span>`
      })
      try {
        await this.savePlayer(player)
        this.showEditPlayer = false
        showMessage('Success', `Player ${this.editMode} complete`)
        this.setPlayersLoaded(true)
        this.id = ''
        this.player = {}
        this.$q.loading.hide()
      } catch (error) {
        showMessage('error', `Error adding player - ${error}`)
        this.setPlayersLoaded(true)
        this.$q.loading.hide()
        this.id = ''
      }
    }
  },

  async beforeMount () {
    if (!this.userInfo.isAdmin && this.mode === 'edit') {
      this.$router.go(-1)
    }
    if (!this.playersLoaded) {
      this.loadPlayers()
    }
  },
  beforeDestroy () {
    this.setSearch('')
  }

}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

  .player-section {
    position: relative;
    height: 100vh;
    width: 100%;
    background-color: black;
    background-image: url(poker_table3_stretched.jpg);
    background-size: 100% 70%;
    background-repeat: no-repeat;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 5rem 5rem 1fr;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background-color:rgba(0,0,0, .55)
    }

    &__title {
      position: relative;
      grid-row-start: 1;
      align-self: center;
      justify-self: center;
      color: white;
    }

    &__search-bar {
      grid-row-start: 2;
      position: relative;
      align-self: flex-start;
      width: 30%;
      background-color: $off-white;
      margin-left: 10rem;
      border-radius: 5px;
      opacity: .9f;
    }

    &__search-bar.isAdmin {
      margin-left: 7rem;
    }

    &__list {
      position: relative;
      grid-row-start: 3;
      max-width: 80rem;
      height: 88%;
      border: inset $lightest-grey;
      border-radius: 1.6rem;
      opacity: .8;
      color: white;
      margin-left: 10rem;
      overflow: auto;

    }
    .player-section__list.isAdmin {
      margin-left: 7rem;
      max-width: 120rem;
    }

  }

  @media screen and (max-width: 1000px) {
    .player-section {
      &__search-bar {
        width: 40%;
        margin-left: 1rem;
      }

      &__search-bar.isAdmin {
        margin-left: 1rem;
      }

      .player-section__list.isAdmin {
        margin-left: 1rem;
      }

      .player-section__list.isNotAdmin {
        margin-left: 1rem;
      }

    }
  }

  @media screen and (max-width: 795px) {
    .player-section {
      background-size: 80% 50%;
      background-position-x: 100px;
      &__search-bar {
        width: 40%;
        margin-left: 1rem;
      }

    }
  }

  @media screen and (max-width: 650px) {
    .player-section {

      &__search-bar {
        width: 50%;
      }

    }
  }

  @media screen and (max-width: 414px) {
    .player-section {
      background-size: 100% 40%;
      background-position-x: 0px;

      &__title {
        font-size: 2rem;
      }

      &__search-bar {
        width: 60%;
      }
    }
  }

  @media screen and (max-width: 377px) {
    .player-section {
      grid-template-rows: 7rem 5rem 1fr;
      &__title {
        font-size: 1.8rem;
        text-align: center;
      }
    }
  }

</style>
