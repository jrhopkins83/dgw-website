<template>
  <div>
    <section class="schedule-section">
      <div class="schedule-section__games">
        <div class="schedule-section__games--heading">
          <div class="title q-mx-lg q-mt-sm text-h4 text-bold">
            Upcoming Games
          </div>
          <div class="actions large-screen gt-xs q-py-none">
            <q-tabs
              v-model="tab"
              dense
              class="text-h4"
              @input="filterGames"
            >
              <q-tab name="all" label="ALL" />
              <q-tab name="mtt" label="MTT" />
              <q-tab name="sng" label="SNG" />
              <q-tab name="cash" label="Cash" />
            </q-tabs>
          </div>
          <div class="actions mobile xs q-py-none">
            <q-btn-dropdown
              class="mobile-menu"
              icon="filter_alt"
              auto-close
              dense
              flat
              round
            >
              <q-list style="min-width: 27rem">
                <q-item
                  clickable
                  ripple
                  @click="setGameFilter('all')"
                >
                  <q-item-section>
                    ALL
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  @click="setGameFilter('mtt')"
                >
                  <q-item-section>
                    MTT
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  @click="setGameFilter('sng')"
                >
                  <q-item-section>
                    SNG
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  ripple
                  @click="setGameFilter('cash')"
                >
                  <q-item-section>
                    CASH
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <ol class="collection collection-container schedule-section__games--table q-mb-sm">
          <!-- The first list item is the header of the table -->
          <li class="item item-container heading-row q-mt-xs" >
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class="attribute-container game-date">
              <div class="attribute date">Date</div>
            </div>
            <div class="attribute-container game-structure">
              <div class="attribute buy-in">Buy In</div>
              <div class="attribute type">Type</div>
              <div class="attribute structure">Structure</div>
            </div>
            <div class="attribute-container game-details">
              <div class="attribute details"></div>
            </div>
          </li>

          <game
            v-for='(game, index) in next4Games'
            :key='index'
            :id='game.id'
            :game='game'
            @viewGameDetails="viewGame"
          >
          </game>
        </ol>
      </div>
    </section>
    <q-dialog
      v-model="showViewGame"
    >
      <view-game-details
        :game="game"
        :id="id"
        @close="showViewGame=false"
      />
    </q-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    game: require('src/components/HomePage/Game.vue').default,
    viewGameDetails: require('src/components/Modals/ModalViewGameDetails.vue').default
  },
  data () {
    return {
      tab: 'all',
      showViewGame: false,
      game: {},
      id: ''
    }
  },
  computed: {
    ...mapGetters('games', ['upcomingGames']),
    next4Games () {
      const next4 = []
      const gamesKeys = Object.keys(this.upcomingGames)
      let limit = 0
      if (gamesKeys.length > 4) {
        limit = 4
      } else {
        limit = gamesKeys.length
      }
      for (let i = 0; i < limit; i++) {
        const key = gamesKeys[i]
        let game = {}
        game = this.upcomingGames[key]
        next4.push(game)
      }

      return next4
    }
  },
  methods: {
    ...mapActions('games', ['setGameFilter']),
    filterGames (value) {
      this.setGameFilter(value)
    },
    viewGame (value) {
      this.game = value[0]
      this.id = value[1]
      this.showViewGame = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .schedule-section {
    position: relative;
    color: black;
    min-height: 32rem;
    width: 100%;
    align-items: center;
    justify-content: center;
    background-image: url(cards1.jpg);
    background: cover;
    background-size: cover;
    display: flex;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent linear-gradient(180deg, #5AD5D5 0%, #00382B 100%) 0% 0% no-repeat padding-box;
    }

    &__games {
      position: relative;
      max-width: 70rem;
      min-height: 26rem;
      background: $white 0% 0% no-repeat padding-box;
      border: 1px solid $light-grey;
      border-radius: 1.7rem;
      opacity: .8;
      overflow: hidden;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 2.5rem 1fr;

      &--heading {
        position: relative;
        grid-row-start: 1;
        height: 1.6rem;
        border-radius: 19px;
        opacity: 1;
        margin-bottom: 1.6rem;
        display: grid;
        grid-template-columns: 1fr 1fr;

        .actions.large-screen {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }

      }

      &--table {
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;
        grid-row-start: 2;
        max-width: 70rem;
        padding: 0px;
        overflow: hidden;

        li {
          list-style: none;
        }

        .heading-row {
          position: sticky;
          top: 0;
          z-index: 1;
          height: 5rem;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: grid;
          grid-template-columns:  7.8rem 4fr 1fr;
          grid-column-gap: 1.6rem;

          .attribute-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

            /* Definition of wrapping column width for attribute groups. */
          }
          .attribute-container.game-structure {
              --column-width-min: 5.2em;
          }
        }
      }
    }
  }

  .q-page {
    min-height: auto;
  }

@media screen and (max-width: 600px) {
  .schedule-section__games--heading {
   grid-template-columns: 1fr .25fr;
  }
  .online-name-header {
    display: none;
  }
}

</style>
