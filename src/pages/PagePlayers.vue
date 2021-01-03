<template>
  <q-page style="min-height: inherit;">
    <transition
      appear
      enter-active-class="animated fadeInLeft"
      leave-active-class="animated fadeOutRight"
    >
      <template v-if="playersLoaded">
        <div class="column container">
          <div class="col header">
            <div class="col-12 header__title text-center">
              <div class="col-12 text-h4 text-weight-bold q-mt-sm q-pt-none q-pb-xs">
                Donkey's Gone Wild Playeres
              </div>
            </div>
          </div>
          <div class="column player-section">
            <div class="column player-section__search-bar q-pa-xs q-ma-md">
              <search>
              </search>
            </div>
            <div class="player-list" :class="isAdmin">
              <player-list
                :playerList="playerList"
                :isAdmin="isAdmin"
                :adminButtons="adminButtons"
              >
              </player-list>
            </div>
          </div>
        </div>
      </template>
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
    ...mapActions('players', ['setPlayersLoaded', 'fbPlayers']),
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
    if (!this.playersLoaded) {
      this.loadPlayers()
    }
  }
}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

  .container {
    position: relative;
    color: black;
    height: 92vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 5rem 1fr;
    align-items: flex-start;
    background-color: black;
    background-image: url(poker_table3_stretched.jpg);
    background-size: 100% 70%;
    background-repeat: no-repeat;

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

    .header {
      position: relative;
      align-items: center;
      color: white;
      background-color: black;

      &--title {
        justify-self: end;
      }

    }

    .player-section {
      position: relative;
      &__search-bar {
        position: relative;
        width: 30%;
        background-color: $off-white;
        margin-left: 10rem;
        border-radius: 5px;
        opacity: .9f;
      }

      &__search-bar.isAdmin {
        margin-left: 7rem;
      }

      .player-list {
        position: relative;
        border: inset $lightest-grey;
        border-radius: 1.6rem;
        opacity: .8;
        margin-left: 10rem;
        height: 74vh;
        justify-self: center;
        overflow: hidden;

      }
      .player-list.isAdmin {
        margin-left: 7rem;
        max-width: 110rem;
      }

      .player-list.isNotAdmin {
        max-width: 80rem;
      }

    }

  }

  @media screen and (max-width: 859px) {
    .container {
      .ranking-section {
        &__header {
          &--title {
            justify-self: center;
          }
        }
      }
    }
  }

  @media screen and (max-width: 385px) {
    .container {
      width: 100%;
      .ranking-section {
        width: 93%;
        &__player-rankings {
          width: 98%;
        }
      }
    }
  }

@media screen and (max-width: 600px) {

  .online-name-header {
    display: none;
  }
}

</style>
