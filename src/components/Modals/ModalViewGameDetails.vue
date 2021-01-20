<template>
  <div class="col game-form">

    <q-card class="add-game absolute-center" style="width: 700px; max-width: 80vw;">
      <q-card-section style="height: 95%; padding: 8px">
        <modal-header>Game Details</modal-header>
        <div class="form-container">
          <div class="attribute-container date">
            <div class="attribute date text-h4">{{ game_date }} at {{ game_time }}</div>
          </div>
          <div class="attribute-container structure">
            <div class="attribute type">
              <div class="label">
                Type
              </div>
              <div class="field">{{ game.type }}</div>
            </div>
            <div class="attribute structure">
              <div class="label">
                Structure
              </div>
              <div class="field">{{ game.structure }}</div>
            </div>
          </div>
          <div class="attribute-container buy-in">
            <div class="attribute buy-in">
              <div class="label">
                Buy-In
              </div>
              <div class="field">{{ formatted_buyIn }}</div>
            </div>
            <div class="attribute rebuy">
              <div class="label">
                Re-Buy
              </div>
              <div class="field">{{ formatted_rebuy }}</div>
            </div>
            <div class="attribute addon">
              <div class="label">
                Add-On
              </div>
              <div class="field">{{ formatted_addOn }}</div>
            </div>
          </div>
          <div class="attribute-container location">
            <div class="label">
              Location
            </div>
            <div class="attribute location field">{{ game.location }}</div>
          </div>
          <div class="attribute-container notes">
            <div class="label">
              Notes
            </div>
            <div>
              <div class="attribute notes" v-html="game.notes"/>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="attribute-container card-actions">
          <q-card-actions align="center">
            <q-btn
              label="Close"
              color="primary"
              @click="$emit('close')"
            />
          </q-card-actions>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { currencyFormat } from 'src/functions/functions-common'
import { mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'ModalViewGameDetails',
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default
  },
  props: {
    game: {
      type: Object
    },
    id: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'gameTemplates']),
    game_date: function () {
      let shortDate = ''
      const startDateTm = this.game.gameDate.toDate()
      if (this.$q.screen.width > 800) {
        shortDate = date.formatDate(startDateTm, 'dddd MMMM Do, YYYY')
      } else {
        shortDate = date.formatDate(startDateTm, 'ddd, MMM Do')
      }
      return shortDate
    },
    game_time: function () {
      // replace after getting data form FS
      const startDateTm = this.game.gameDate.toDate()
      const shortDate = date.formatDate(startDateTm, 'hh:mm aa')
      return shortDate
    },
    formatted_buyIn () {
      if (!isNaN(this.game.buyIn)) {
        return currencyFormat.format(this.game.buyIn)
      } else {
        return 0
      }
    },
    formatted_rebuy () {
      if (!isNaN(this.game.rebuy)) {
        return currencyFormat.format(this.game.rebuy)
      } else {
        return 0
      }
    },
    formatted_addOn () {
      if (!isNaN(this.game.addon)) {
        return currencyFormat.format(this.game.addon)
      } else {
        return 0
      }
    }

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .game-form {
    width: 90%;
    background-color: #C3C3C3;

    .q-card.add-game {
      max-width: 75vw;
      width:40vw;
      // height:150px;

      .form-container {
        display: flex;
        justify-content: center;
        padding: 1.6rem;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 2rem 9rem 9rem 10rem 18rem;

        .attribute-container {
          margin-bottom: 1.6rem;

          .field {
            background-color: #e5e2e2;
            padding: 8px;
          }
        }

        .attribute-container.structure {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 1rem;
        }

        .attribute-container.date {
          display: grid;
          grid-template-columns: 1fr;
        }

        .attribute.location {
          min-height: 5rem;
        }

        .attribute.notes {
          min-height: 17rem;
        }

        .attribute-container.buy-in {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-column-gap: 1rem;
        }

        .q-field__input {
          font-size: 16px
        }

      }

      .label {
        font-size: 20px;
        font-weight: bold;
        margin: 12px 0px 8px 0px;
      }
      .q-input {
        max-width: 90%;
      }
    }
  }

@media screen and (max-width: 414px) {
  .q-dialog__inner--minimized {
    padding: 8px !important;
  }
  .form-container {
    padding: 8px !important;
  }
}

@media screen and (max-width: 395px) {
  .attribute.notes {
    min-height: 12rem !important;
  }

}
@media screen and (max-width: 375px) {
  .attribute.date {
    font-size: 18px !important;
  }
  .label {
    font-size: 16px !important;
  }
}
</style>
