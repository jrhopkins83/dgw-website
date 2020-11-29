<template>
  <div>
    <section class="schedule-section">
      <div class="schedule-section__games q-mb-sm">
        <div class="row games-card">
          <div class="title q-mx-lg q-mt-sm text-h4 text-bold">
            Upcoming Games
          </div>
          <div class="actions large-screen gt-xs q-py-none">
            <q-tabs
              v-model="tab"
              dense
              class="text-h4"
              @click="filterGames"
            >
              <q-tab name="all" label="ALL" />
              <q-tab name="mtt" label="MTT" />
              <q-tab name="sng" label="SNG" />
              <q-tab name="cash" label="Cash" />
            </q-tabs>
          </div>
          <div class="actions mobile xs q-py-none">
            <q-btn
              class="mobile-menu"
              icon="filter_alt"
              v-model="tab"
              dense
              flat
              round
              @input="filterGames"
            >
              <q-menu
                transition-show="jump-down"
                transition-hide="jump-up"
              >
              <q-list style="min-width: 120rem">
                <q-item clickable>
                  <q-item-section>ALL</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>MTT</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>SNG</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Cash</q-item-section>
                </q-item>
              </q-list>
              </q-menu>
            </q-btn>

          </div>
        </div>
        <div class="div games-section">
          <ol class="collection collection-container games-section__games--table q-mb-sm">
            <!-- The first list item is the header of the table -->
            <li class="item item-container heading-row q-mt-xs" >
              <!-- Enclose semantically similar attributes as a div hierarchy -->
              <div class="attribute-container game-information">
                <div class="attribute date">Date</div>
                <div class="attribute buy-in">Buy-In</div>
                <div class="attribute type">Type</div>
              </div>
              <div class="attribute-container game-structure">
                <div class="attribute structure">Structure</div>
                <div class="attribute details"></div>
              </div>
            </li>

            <game
              v-for='(game, index) in next4Games'
              :key='index'
              :id='game.id'
              :game='game'
            >
            </game>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    game: require('src/components/HomePage/Game.vue').default
  },
  data () {
    return {
      tab: 'all'
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
    filterGames (value) {
      console.log(value.payload)
    },
    viewGameDetails (value) {

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
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(cards1.jpg);
    background: cover;
    background-size: cover;

    &::before {
      content: "";
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      background: transparent linear-gradient(180deg, #5AD5D5 0%, #00382B 100%) 0% 0% no-repeat padding-box;
    }

    .actions.large-screen {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;

    }
    &__games {
      position: relative;
      max-width:60rem;
      min-height: 26rem;
      background: $white 0% 0% no-repeat padding-box;
      border: 1px solid $light-grey;
      border-radius: 1.7rem;
      opacity: .8;

      .games-card {
        position: relative;
        width:100%;
        height: 95%;
        // background-color: $royal-blue;
        min-height: 90%;
        border-radius: 19px;
        opacity: 1;
        margin-bottom: 1.6rem;

        &__title {
          color: $white;
        }

        &__actions {
          color: $white;
        }
      }
    }
  .games-section {
    font-size: 18px;

    ol.collection {
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
    }

    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    &__games {
      height: 66vh;
      width: 100%;
      overflow: scroll;
      border-radius: 2.5rem;
      opacity: 0.8;

      .no-games {
        max-width: 90vw;
        font-size: 2.4rem;

      }
      &--table {
        margin: 0 .6rem .6rem .6rem;
        position: relative;
        max-width: 120rem;

        .heading-row {
          position: sticky;
          top: 0;
          color:  black;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          text-decoration-line: underline;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: grid;
          grid-template-columns: 1fr 4fr;
          grid-gap: 1rem;

          .attribute-container.game-information {
            display: grid;
            grid-template-columns: 8rem 6rem 6rem;
            grid-gap: 1rem;
          }

          .attribute-container.game-structure {
            display: grid;
            grid-template-columns: 26rem 5rem;

            .attribute.structure {
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
          }

        }
      }
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

  .date {
    margin-right: 16px;
    }
  }

</style>
