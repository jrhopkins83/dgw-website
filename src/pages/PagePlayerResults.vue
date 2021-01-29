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
                <q-avatar>
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
  // min-height: 95vh;
  width: 100%;
  color: white;
  display: grid;
  grid-template-columns: 1.5fr 4.5fr 3fr;
  gap: 0px 0px;

  .player-image {
    margin-top: 2rem;
    .q-avatar {
      font-size: 78px;
    }
  }

  .headline {
    position: relative;
    text-align: center;
    margin-top: 2rem;
    justify-self: center;
    align-self: center;
  }

  .player-results {
    max-width: 70rem;
  }

}

  @media screen and (max-width: 712px) {
    .grid-container {
      grid-template-columns: 1.5fr 8fr 3fr;
    }
  }

  @media screen and (max-width: 567px) {
    .grid-container {
      grid-template-columns: 1.5fr 8fr 2fr;
    }
  }

  @media screen and (max-width: 522px) {
    .grid-container {
      grid-template-columns: 1fr 8fr 1fr;

      .player-image {
        .q-avatar {
          font-size: 54px;
          margin-left: 1rem;
        }
      }
    }
  }

  @media screen and (max-width: 465px) {
    .grid-container {
      grid-template-columns: 1fr 8fr .5fr;
    }
  }

  @media screen and (max-width: 431px) {
    .grid-container {
      .results-table {
        margin-top: 1rem;
        margin-left: -5rem;
      }
    }
  }
</style>
