<template>
  <div>
    <section class="schedule-section">
      <div class="schedule-section__games q-mb-sm">
        <div class="row justify-evenly games-card">
          <div class="title q-ml-lg q-mt-sm text-h4 text-bold">
            Upcoming Games
          </div>
          <div class="actions gt-xs q-py-none">
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
          <div class="actions xs q-py-none">
            <q-btn
              class="mobile-menu"
              icon="filter_alt"
              v-model="tab"
              dense
              flat
              round
              @click="filterGames"
            >
              <q-menu
                transition-show="jump-down"
                transition-hide="jump-up"
              >
              <q-list style="min-width: 10rem">
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

        <ol class="collection collection-container game-table">
          <!-- The first list item is the header of the table -->
          <li class="item item-container game-table__heading">
            <div class="attribute date">Date</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class="attribute-container game-information">
              <div class="attribute-container game-names">
                <div class="attribute type">Type</div>
                <div class="attribute buyin">Buy In</div>
                <div class="attribute structure">Structure</div>
              </div>
            </div>
          </li>
          <!-- The rest of the items in the list are the actual data -->
          <li class="item item-container game-table__items q-py-sm"
            v-for="(game, gamesID) in games"
            :key="gamesID"
            :game="game"
            @select="viewGameDetails"
          >
            <div class="attribute date">{{ game.date }}</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class="attribute-container game-information">
              <div class="attribute-container game-names">
                <div class="attribute type">{{ game.type }}</div>
                <div class="attribute buyin">{{ game.buyin}}</div>
                <div class="attribute structure">{{ game.structure }}</div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      tab: 'all',
      games: [
        {
          date: '09/17/2020',
          startTime: '6:30 PM',
          buyin: 100,
          rebuy: null,
          addOn: null,
          type: 'MTT',
          structure: 'Freezeout',
          notes: 'Some notes abou the game',
          location: 'Pokerbros'
        },
        {
          date: '09/19/2020',
          startTime: '7:00 PM',
          buyin: null,
          rebuy: null,
          addOn: null,
          type: 'Cash',
          structure: '.5/$1 NLH and PLO',
          notes: 'Some notes abou the game',
          location: 'Pokerbros'
        },
        {
          date: '09/21/2020',
          startTime: '7:00 PM',
          buyin: null,
          rebuy: null,
          addOn: null,
          type: 'SNG',
          structure: '6-max Sit-N-Go',
          notes: 'Multiple tables of $10, $20 and $50 buy-in NLH and PLO. Tournament starts when all 6 seats are filled',
          location: 'Pokerbros'
        },
        {
          date: '09/24/2020',
          startTime: '6:30 PM',
          buyin: 40,
          rebuy: 40,
          addOn: 40,
          type: 'MTT',
          structure: 'Rebuy with add-on',
          notes: 'Unlimited rebuys until level 10.  $40 add-on after level 10.',
          location: 'Pokerbros'
        }
      ]
    }
  },
  computed: {

  },
  methods: {
    filterGames (value) {

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

    ol.collection {
      position: relative;
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 120rem;
      color: black;
    }

    li {
      list-style: none;
    }

    * {
      box-sizing: border-box;
    }

    &__games {
      position: relative;
      max-width:80rem;
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
      margin-bottom: 8px;

      &__title {
        color: $white;
      }

      &__actions {
        color: $white;
      }
    }

      .game-table {
        margin: 0 1.6rem 1.6rem 1.6rem;

        &__heading-row {
          // color: $white;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &__items {
          color: $black;
          // background-color: $light-blue;
          border-bottom: solid $lightest-grey;
          width: 100%;

          .attribute.rank {
            font-weight: bold;
            color: $primary
          }

          .attribute-container.points {
            font-weight: bold;
            color: $primary
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

/* Tabular Layout */
@media screen and (min-width: 360px) {
  .schedule-section {

    /* The maximum column width, that can wrap */
      .item-container {
          display: grid;
          grid-template-columns: 1fr 5fr;
      }

      .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

      /* Definition of wrapping column width for attribute groups. */
      .game-information {
          --column-width-min: 8.2em;
      }

  /* Center header labels */
  .collection-container > .item-container:first-child .attribute {
    display: flex;
    align-items:flex-end;
    justify-content: flex-start;
    text-overflow: initial;
    overflow: auto;
    white-space: normal;
    font-weight: bold;
    margin: 8px 0 4px 0
  }

  .date {
    margin-right: 16px;
    }
  }

}
</style>
