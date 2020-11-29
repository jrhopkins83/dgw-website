<template>
  <transition
    appear
    enter-active-class="animated slideInLeft"
    leave-active-class="animated slideOutRight"
  >
    <div  class="payout-section">
      <div class="column payout-section__header items-center text-white">
        <div class="col payout-section__header--title text-h3">
          {{ tournament_date }}
        </div>
        <div class="col payout-section__header--structure text-h4">
          {{ structure }}
        </div>
      </div>
      <div class="column justify-center payout-section__form">
        <div class="payout-pool">
          <div class="form">
            <div class="form-inputs">
              <q-form>
                <div class="label text-bold text-white">
                  Prize Pool
                </div>
                <q-field
                  type="number"
                  ref="prizePool"
                  filled
                  v-model="formData.prizePool"
                  bg-color="grey-1"
                  class="q-mt-lg"
                  outlined
                  :dense="dense"
                  style="width: 12rem"
                >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                    <money
                      v-show="floatingLabel"
                      v-bind="moneyFormatForComponent"
                      :id="id"
                      :value="value"
                      @input="emitValue"
                      class="q-field__input text-right"
                    />
                  </template>
                </q-field>
                <div class="label text-bold text-white">
                  Final Table
                </div>
                <q-field
                  type="number"
                  filled
                  v-model.number="formData.finalTable"
                  bg-color="grey-1"
                  class="q-mt-lg"
                  outlined
                  :dense="dense"
                  style="width: 12rem"
                >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                    <money
                      v-show="floatingLabel"
                      v-bind="moneyFormatForComponent"
                      :id="id"
                      :value="value"
                      @input="emitValue"
                      class="q-field__input text-right"
                    />
                  </template>
                </q-field>

                <div class="label text-bold text-white">
                  Player of the Year
                </div>
                <q-field
                  type="number"
                  filled
                  v-model="formData.playerOfTheYear"
                  bg-color="grey-1"
                  class="q-mt-lg"
                  outlined
                  :dense="dense"
                  style="width: 12rem"
                >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                    <money
                      v-show="floatingLabel"
                      v-bind="moneyFormatForComponent"
                      :id="id"
                      :value="value"
                      @input="emitValue"
                      class="q-field__input text-right"
                    />
                  </template>
                </q-field>

                <div class="label text-bold text-white">
                  DGW
                </div>
                <q-field
                  type="number"
                  filled
                  v-model.number="formData.DGW"
                  bg-color="grey-1"
                  class="q-mt-lg"
                  outlined
                  :dense="dense"
                  style="width: 12rem"
                >
                  <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                    <money
                      v-show="floatingLabel"
                      v-bind="moneyFormatForComponent"
                      :id="id"
                      :value="value"
                      @input="emitValue"
                      class="q-field__input text-right"
                    />
                  </template>
                </q-field>

                <div class="label text-bold text-white">
                  Final Table Players
                </div>
                <q-input
                  type="number"
                  v-model.number="formData.finalTablePlayers"
                  :dense="dense"
                  filled
                  bg-color="grey-1"
                  class="q-ml-xl"
                  outlined
                  style="width: 8rem; margin-left: 4rem"
                >
                </q-input>
              </q-form>
            </div>
            <div class="justify-evenly q-mt-xl q-mb-sm">
              <q-btn
                color="primary"
                icon="cancel"
                label="Cancel"
                class="q-mr-sm"
                @click="$emit('cancel')"
              />
              <q-btn
                color="blue-7"
                icon-right="navigate_next"
                label="Enter Payouts"
                class="q-ml-sm"
                @click="enterPayouts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Money } from 'v-money'

export default {
  name: 'PayoutPool',
  props: {
    formData: Object,
    tournament_date: String,
    structure: String
  },
  components: { Money },
  data () {
    return {
      dense: true,
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: '',
        precision: 0,
        masked: true
      }
    }
  },

  methods: {
    focusInput () {
      this.$refs.prizePool.$el.focus()
    },
    enterPayouts () {
      this.$emit('enterPayouts', 'places')
    }
  },
  mounted () {
    this.focusInput()
  }
}
</script>

<style lang="scss" scoped>

  .payout-section {
    // width: 100%; TO-DO: see if form elements change width
    height: 90%;
    position: relative;
    border: 1px solid var(--llight-grey);
    background: transparent linear-gradient(0deg, #44738F 0%, #3A367A 100%) 0% 0% no-repeat padding-box;
    border: 1px solid #707070;
    border-radius: 21px;
    opacity: 0.9;

    &__header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.6rem;

      &--title {
        font-weight: bold;
      }

      &--structure {
        font-weight: bold;
        margin: 1.6rem auto 1.6rem auto
      }
    }

    &__form {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0px;
    }
  }

  .form-inputs {
    display: flex;
    justify-content: center;
  }

  .label {
    font-size: 20px;
    margin: 12px 0px 8px 0px;
  }
  .q-field__input {
    font-size: 16px
  }

// Transition styles
  .slide-left-enter-active, .slide-left-leave-active {
    transition: all 2s ease-in-out;
  }
  .slide-left-enter, .slide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform :  translateX(100px);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

// Media queries
  @media screen and (max-width: 859px) {

  }

</style>
