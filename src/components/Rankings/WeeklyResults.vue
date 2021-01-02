<template>
  <div>
    <section class='rankings-section'>
      <div class='rankings-section__players q-mb-sm'>
        <ol class='collection collection-container player-table q-mb-sm'>
          <!-- The first list item is the header of the table -->
          <li class='item item-container player-table__heading-row'>
            <div class='attribute'>Position</div>
            <div class='attribute'>Player</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class='attribute-container player-information'>
              <div class='attribute-container player-names'>
                <div class='attribute gt-xs'>Name</div>
                <div class='attribute gt-xs'>Nickname</div>
                <div class='attribute gt-xs'>Online Name</div>
              </div>
            </div>
            <div class='attribute-container points'>
              <div class='attribute'>Pts</div>
            </div>
            <div class='attribute-container gt-xs winnings'>
              <div class='attribute'>Winnings</div>
            </div>
          </li>
          <!-- The rest of the items in the list are the actual data -->
          <player-rank
            v-for='(player, playerID) in weeklyResults'
            :key='playerID'
            :player='player'
            @select='viewPlayerDetails'
          >
          </player-rank>
        </ol>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'WeeklyResults',
  components: {
    playerRank: require('components/Rankings/PlayerResult.vue').default
  },
  props: ['weeklyResults'],
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    viewPlayerDetails (playerID) {
      this.$router.push({ name: 'PlayerResults', params: { playerID: playerID } }).catch((err) => {
        console.log('error', `Problem handling something: ${err}.`)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .rankings-section {
    height: 74vh;
    overflow: hidden;

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

    &__players {
      background-color:$off-white;
      height: 74vh;
      max-width: 120rem;
      overflow: scroll;
      border-radius: 2.5rem;
      opacity: 1;

      .player-table {
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;
        max-width: 120rem;

        &__heading-row {
          position: sticky;
          z-index: 1;
          top: 0;
          background-color: $off-white;
          opacity: 1;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          text-decoration: underline;
        }

        /* The maximum column width, that can wrap */
          .item-container {
              display: grid;
              grid-template-columns: 4em 5em 8fr 2fr 2fr;
          }

          .attribute-container {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));
          }

          /* Definition of wrapping column width for attribute groups. */
          .player-information {
              --column-width-min: 8.2em;
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
  .rankings-section {

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

  .rank, .points , .games, .average, .winnings {
    display: flex;
    align-items: center;
    justify-content: center;
    }
  }

}
</style>
