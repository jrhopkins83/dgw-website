<template>
  <div>
    <section class="schedule-section">
      <div class="schedule-section__games q-ma-md">
        <ol class="collection collection-container game-table q-mb-sm">
          <!-- The first list item is the header of the table -->
          <li class="item item-container game-table__heading-row">
            <div class="attribute">Date</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class="attribute-container game-information">
              <div class="attribute-container game-details">
                <div class="attribute buyin">Buy-In</div>
                <div class="attribute type">Type</div>
                <div class="attribute structure">Structure</div>
              </div>
            </div>
          </li>
          <!-- The rest of the items in the list are the actual data -->
          <li class="item item-container game-table__items q-mt-xs"
            v-for="(game, id) in games"
            :key="id"
            @select="viewGameDetails"
          >
            <div class="attribute rank">{{game.date }}</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class="attribute-container game-information">
              <div class="attribute-container game-details">
                <div class="attribute buyin">{{ game.buyin }}</div>
                <div class="attribute type">{{ game.type}}</div>
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
          structure: '.5/1 NLH and PLO',
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
    viewGameDetails () {

    }
  }
}
</script>

<style lang="scss" scoped>
  .schedule-section {
    position: relative;
    min-height: 32rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    ol.collection {
      position: relative;
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

    &__game {
      background-color: $royal-blue;
      min-height: 90%;
      max-width: 55rem;
      margin-top: 1.6rem;
      opacity: .8;

      &::before {
        content: "";
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-color: rgba(0,0,0,0.25);
      }

      .game-table {
        margin: 0 1.6rem 1.6rem 1.6rem;

        &__heading-row {
          font-weight: bold;
          margin-bottom: 8px;
        }
        &__items {
          width: 100%;
          margin-bottom: 4px;

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
          grid-template-columns: 6em 30em;
      }

      .attribute-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
      }

      /* Definition of wrapping column width for attribute groups. */
      .game-information {
        --column-width-min: 5em;
      }

      .attribute.buyin {
        width: 7rem;
      }

      .attribute.type {
        width: 5rem;
      }

      .attribute.structure {
        width: 20rem;
      }

  /* Center header labels */
  .collection-container > .item-container:first-child .attribute {
    display: flex;
    align-items:flex-end;
    text-overflow: initial;
    overflow: auto;
    white-space: normal;
    font-weight: bold;
  }

  .rank, .points , .games, .average, .winnings {
    display: flex;
    align-items: center;
    justify-content: center;
    }
  }

}
</style>
