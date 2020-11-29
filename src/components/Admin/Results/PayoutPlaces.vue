<template>
  <transition
    appear
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutLeft "
  >
    <div class="payout-section">
      <div class="column payout-section__header items-center text-white">
        <div class="col payout-section__header--title text-h3">
          {{ tournament_date }}
        </div>
        <div class="col payout-section__header--structure text-h4">
          {{ structure }}
        </div>
      </div>
      <div class="column justify-center payout-section__form">
        <div class="payout-places">
          <div class="form">
            <div class="form-inputs">
              <q-form>
                <div class="form-inputs__totals q-mb-md">
                  <div class="inputs">
                    <div class="label text-bold text-white">Payout</div>
                    <q-field
                      type="number"
                      ref="payoutTotal"
                      filled
                      disable
                      v-model.number="formData.payoutTotal"
                      bg-color="grey-1"
                      class="q-mt-lg"
                      outlined
                      :dense="dense"
                      style="width: 12rem"
                    >
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
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
                  </div>
                  <div class="inputs">
                    <div class="label text-bold text-white">Places Paid</div>
                    <q-input
                      type="number"
                      ref="placesPaid"
                      v-model.number="formData.placesPaid"
                      :dense="dense"
                      filled
                      bg-color="grey-1"
                      class="q-ml-xl"
                      outlined
                      style="width: 8rem; margin-left: 4rem"
                    >
                    </q-input>
                  </div>
                </div>

                <div
                  v-if="formData.placesPaid === 0"
                  class="q-mb-md text-white"
                >
                  Enter number (1-10) of places paid to proceed
                </div>

                <q-separator inset dark />

                <div>
                  <transition-group name="places" class="form-inputs__places">
                    <div v-for="n in formData.placesPaid" :key="n">
                      <div class="label text-bold text-white">
                        {{ formData.payouts[n - 1].label }}
                      </div>
                      <q-field
                        type="number"
                        filled
                        v-model.number="formData.payouts[n - 1].amount"
                        bg-color="grey-1"
                        class="q-mt-lg"
                        outlined
                        :dense="dense"
                        style="width: 12rem"
                      >
                        <template
                          v-slot:control="{ id, floatingLabel, value, emitValue }"
                        >
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
                    </div>
                  </transition-group>
                </div>
              </q-form>
            </div>
            <div class="q-mt-xl q-mx-sm q-pb-sm">
              <q-btn-group>
                <q-btn
                  color="blue-9"
                  push
                  outlined
                  rounded
                  icon="navigate_before"
                  label="Back"
                  @click="$emit('goBack')"
                />
                <q-btn
                  color="blue-7"
                  outlined
                  push
                  icon="check_circle"
                  label="Finish"
                  class="q-mx-md"
                  @click="$emit('finish')"
                />
                <q-btn
                  color="primary"
                  push
                  outlined
                  icon="cancel"
                  label="Cancel"
                  @click="$router.go(-1)"
                />
              </q-btn-group>
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
  name: 'PayoutPlaces',
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
      this.$refs.placesPaid.$el.focus()
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

  &__totals {
    width: 100%;
    display: grid;
    grid-template-columns: 10em 8em;

    .inputs {
      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(--column-width-min), 1fr)
      );
    }
  }
  &__places {
    width: 100%;
    display: grid;
    grid-template-rows: repeat(4, 5rem);
    gap: 4rem;
    grid-auto-flow: column;
    grid-auto-columns: 12rem 12rem;
    margin-bottom: 1rem;
  }
  .label {
    font-size: 20px;
    margin: 12px 0px 8px 0px;
  }
  .q-field__input {
    font-size: 16px;
  }
}
.places-move {
  transition: transform .6s;
}
.places-enter-active, .places-leave-active {
  transition: all .6s;
}
.places-enter, .places-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
