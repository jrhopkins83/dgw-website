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
            >
            </player-list>
          </div>
          </div>
    </transition>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { showMessage } from 'src/functions/functions-common'

export default {
  name: 'PagePlayers',
  components: {
    playerList: require('components/Players/PlayerList.vue').default,
    search: require('components/Players/Search.vue').default
  },
  props: {
    mode: {
      type: String,
      default: 'view'
    }
  },
  data () {
    return {

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
    color: black;
    height: 100vh;
    width: 100%;
    background-color: black;
    background-image: url(poker_table3_stretched.jpg);
    background-size: 100% 70%;
    background-repeat: no-repeat;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 5rem 5rem 1fr;

    // overflow: hidden;

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
      border: inset $lightest-grey;
      border-radius: 1.6rem;
      opacity: .8;
      color: white;
      margin-left: 10rem;
      height: 88%;
      overflow: hidden;

    }
    .player-section__list.isAdmin {
      margin-left: 7rem;
      max-width: 110rem;
    }

  }

  @media screen and (max-width: 1000px) {
    .player-section {
      &__search-bar {
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
    }
  }

  @media screen and (max-width: 414px) {
    .player-section {
      background-size: 100% 40%;
      background-position-x: 0px;
    }
  }

</style>
