<template>
  <div>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <template v-if="playerResultsLoaded && playersLoaded && standingsLoaded">
        <q-page>
          <div class="grid-container">
            <div class="player-image">
              <div class="text-center q-mb-xl">
                <q-avatar size="78px">
                  <img :src="player_avatar.avatarUrl">
                </q-avatar>
              </div>
            </div>
            <div class="player-results">
              <div class="headline text-h3 text-bold">
                Season Results for {{ playerNames.firstName }} {{ playerNames.lastName}}
              </div>
              <div class="results-table">
                <player-results
                  :playerResults="playerResults"
                  :playerTotals="playerTotals"
                >
                </player-results>
              </div>
            </div>
            <div class="right-image"></div>
          </div>
        </q-page>
      </template>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PagePlayerResults',
  components: {
    playerResults: require('components/Rankings/PlayerWeeklyResults.vue').default
  },
  props: {
    playerID: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('weeklyResults', ['playerResultsLoaded', 'playerResults']),
    ...mapGetters('players', ['playersLoaded', 'playersSorted']),
    ...mapGetters('standings', ['standingsSorted', 'standingsLoaded']),
    player_avatar: function () {
      if (this.playerNames.avatar.avatarUrl) {
        return this.playerNames.avatar
      } else {
        const image = {
          avatarUrl: 'default.jpg',
          avatarName: 'default.jpg'
        }
        return image
      }
    },
    playerTotals: function () {
      return this.standingsSorted.find(standing => standing.playerID === this.playerID)
    },
    playerNames: function () {
      return this.playersSorted[this.playerID]
    }
  },
  methods: {
    ...mapActions('weeklyResults', ['fbPlayerResults', 'resetResults'])
  },
  async mounted () {
    await this.fbPlayerResults(this.playerID)
  }
  // async beforeDestroy () {
  //   await this.resetResults()
  // }
}
</script>

<style lang="scss" scoped>
.q-page {
  background-image: url(chip-handling2.jpg);
  background-repeat: no-repeat;
  background-size: cover;

    &::before {
    content: "";
    position: absolute;
    top: 65px;
    left: 0px;
    width: 100vw;
    height: 93vh;
    /* UI Properties */
    background: #060607 0% 0% no-repeat padding-box;
    opacity: .5;
  }

}

html, body, .grid-container { height: 100%; margin: 0; }

.material-icons {
  font-size: 54px;
}

.grid-container {
  position: relative;
  min-height: 93vh;
  width: 100%;
  color: white;
  display: grid;
  grid-template-columns: 1.5fr 4.5fr 4fr;
  gap: 0px 0px;

  .player-image {
    margin-top: 3rem;
  }

  .headline {
    position: relative;
    margin-top: 3rem;
    justify-self: center;
    align-self: center;
  }

  // .right-image{

  // }
}

</style>
