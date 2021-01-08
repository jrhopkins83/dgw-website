<template>
  <div>
    <section class='rankings-section'>
      <div class='rankings-section__players scroll q-mb-sm'>
        <ol class='collection collection-container player-table q-mb-sm'>
          <!-- The first list item is the header of the table -->
          <li class='item item-container player-table__heading-row q-pb-sm'>
            <div class='attribute rank q-ml-xs'>Rank</div>
            <div class='attribute player'>Player</div>
            <!-- Enclose semantically similar attributes as a div hierarchy -->
            <div class='attribute-container player-information'>
              <div class='attribute-container player-names'>
                <div class='attribute name'>Name</div>
                <div class='attribute nick-name gt-xs'>Nickname</div>
                <div class='attribute online-name'>Online Name</div>
              </div>
            </div>
            <div class='attribute-container stats'>
              <div class='attribute points'>Points</div>
              <div class='attribute games gt-xs'>Games</div>
              <div class='attribute average gt-xs'>Pts / Game</div>
              <div class='attribute winnings'>Winnings</div>
            </div>
          </li>
          <!-- The rest of the items in the list are the actual data -->
          <player-rank
            v-for='(player, playerID) in standings'
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
  components: {
    playerRank: require('components/Rankings/PlayerRanking.vue').default
  },
  props: ['standings'],
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
    height: 70rem;
    overflow: hidden;

    ol.collection {
      margin: 0 1.6rem 1.6rem 1.6rem;
      padding: 0px;
      max-width: 93rem;

      li {
        list-style: none;
      }

      .item-container {
          display: grid;
          grid-template-columns: 4em 5em 8fr 6fr;

      }

      .attribute-container {
        display: grid;
          grid-template-columns: repeat(auto-fit, minmax(var(--column-width-min), 1fr));

          .attribute {
            display: flex;
            align-self: end;
          }
      }

      /* Definition of wrapping column width for attribute groups. */
      .player-information {
          --column-width-min: 8.2em;
      }

      .stats {
          --column-width-min: 4.2em;
      }

      // .rank, .player, .points, .games, .average, .winnings {
      //   display: flex;
      //   align-self: end;
      // }

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

    }

    * {
      box-sizing: border-box;
    }

    &__players {
      // background-color: white;
      height: 70rem;
      max-width: 93rem;
      overflow: auto;
      border-radius: 2.5rem;
      opacity: .9;

      .player-table {
        margin: 0 1.6rem 1.6rem 1.6rem;
        position: relative;
        max-width: 93rem;

        &__heading-row {
          position: sticky;
          top: 0;
          z-index: 1;
          height: 5rem;
          background-color: #ddf7ff;
          align-items:flex-end;
          justify-content: center;
          text-overflow: initial;
          white-space: normal;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: .8rem;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
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

</style>
