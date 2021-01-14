<template>
  <div class="col game-form">

    <q-card class="add-game absolute-center" style="width: 700px; max-width: 80vw;">
      <q-card-section style="min-height: 62rem">
        <modal-header>{{ displayMode }} Game</modal-header>
        <q-form
          ref="gameForm"
        >
          <div class="form-container">
            <div class="attribute-container structure q-mb-lg">
              <q-select
                dense
                outlined
                ref="template"
                v-model="template"
                fill-input
                class=“no-pointer-events”
                input-class="text-center"
                label="Template"
                stack-label
                :options="templateOptions"
                option-value="index"
                option-label="template"
                option-disable="inactive"
                emit-value
                map-options
                style="min-width: 250px; max-width: 300px; margin-bottom: 2rem"
                @input="pullFromTemplate($event)"
              />
              <q-select
                dense
                outlined
                ref="structure"
                fill-input
                v-model="formData.structure"
                class=“no-pointer-events”
                input-class="text-center"
                label="Structure"
                stack-label
                :rules="[required]"
                :options="structureOptions"
                style="width: 12rem"
              />
              <q-select
                dense
                outlined
                ref="type"
                fill-input
                v-model="formData.type"
                class=“no-pointer-events”
                input-class="text-center"
                label="Type"
                stack-label
                :rules="[required]"
                :options="typeOptions"
                style="width: 12rem"
              />
            </div>
            <div class="attribute-container date">
              <modal-pick-date
                outlined
                ref="gameDate"
                fill-input
                :rules="[required]"
                :pickDate.sync="formData.gameDate"
                style="width: 20rem"
              />
              <modal-pick-time
                outlined
                ref="gameTime"
                fill-input
                :rules="[required]"
                :pickTime.sync="formData.gameTime"
                style="width: 20rem"
              />
            </div>
            <div class="attribute-container" v-if="formData.type === 'MTT'">
              <q-checkbox left-label v-model="formData.seasonTournament" label="Include in Season Totals" />
            </div>
            <div class="attribute-container buy-in">
              <q-field
                type="number"
                ref="buyIn"
                v-model="formData.buyIn"
                bg-color="grey-1"
                class="q-mt-lg"
                outlined
                label="Buy-In"
                stack-label
                :rules="[required]"
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
              <q-field
                type="number"
                ref="rebuy"
                v-model="formData.rebuy"
                bg-color="grey-1"
                class="q-mt-lg"
                outlined
                label="Re-buy"
                stack-label
                :rules="[required]"
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
              <q-field
                type="number"
                ref="addOn"
                v-model="formData.addOn"
                bg-color="grey-1"
                class="q-mt-lg"
                outlined
                label="Add-on"
                stack-label
                :rules="[required]"
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
            </div>
            <div class="attribute-container location">
              <q-input
                ref="location"
                v-model="formData.location"
                label="Location"
                stack-label
                clearable
                clear-icon="close"
                outlined
                type="textarea"
                :input-style="locationStyle"
              />
            </div>
            <div class="attribute-container notes">
              <div class="label text-bold">
                Notes
              </div>
              <div class="attribute-container text">
                <modal-q-editor
                  ref="newsText"
                  :qeditor.sync="formData.notes"
                  :editorMinHeight="editorMinHeight"
                  :editorMaxHeight="editorMaxHeight"
                >
                </modal-q-editor>
            </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <div class="attribute-container card-actions">
          <q-card-actions align="center">
            <q-btn
              label="Submit"
              color="blue-9"
              text-color="white"
              @click="submitForm"
            />

            <q-btn
              label="Cancel"
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
import formMixin from 'src/mixins/form'
import { selectAll } from 'src/directives/directive-select-all'
import { required } from 'src/utils/validators'
import { toTitleCase } from 'src/functions/functions-common'
import { mapGetters } from 'vuex'
import { Money } from 'v-money'
import { date } from 'quasar'

export default {
  mixins: [formMixin],
  components: {
    Money,
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default,
    modalPickDate: require('src/components/Modals/Shared/ModalDate.vue').default,
    modalPickTime: require('src/components/Modals/Shared/ModalTime.vue').default,
    modalQEditor: require('components/Modals/Shared/ModalQEditor.vue').default
  },
  props: {
    game: {
      type: Object
    },
    id: {
      type: String
    },
    mode: {
      type: String
    }
  },
  data () {
    return {
      dense: true,
      name,
      formData: {
        type: '',
        gameDate: '',
        gameTime: '',
        structure: '',
        seasonTournament: false,
        buyIn: 0,
        rebuy: 0,
        addOn: 0,
        location: '',
        notes: '',
        id: this.id
      },
      formHasError: false,
      template: '',
      gameToSubmit: {},
      validation: false,
      editorMinHeight: '10rem',
      editorMaxHeight: '30rem',
      moneyFormatForComponent: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: '',
        precision: 0,
        masked: true
      },
      locationStyle: '{ "max-height: 10rem" }'

    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'gameTemplates']),
    templateOptions: function () {
      const optionArray = []
      let option = {}
      this.gameTemplates.forEach((template, index) => {
        option = {
          index: index,
          template: template.template
        }
        optionArray.push(option)
      })
      return optionArray
    },
    structureOptions: function () {
      return this.leagueInfo.tournamentStructures
    },
    typeOptions: function () {
      return this.leagueInfo.gameTypes
    },
    displayMode: function () {
      return toTitleCase(this.mode)
    }
  },
  methods: {
    required,
    async submitForm () {
      this.$refs.structure.validate()
      this.$refs.type.validate()
      // this.$refs.gameDate.validate()
      // this.$refs.gameTime.validate()
      this.$refs.buyIn.validate()
      this.$refs.location.validate()

      // if (this.$v.$invalid) {
      //   this.$nextTick(() => this.focusFirstStatus())
      if (this.$refs.structure.hasError || this.$refs.type.hasError || this.$refs.buyIn.hasError || this.$refs.location.hasError) {
        this.formHasError = true
      }

      if (!this.formHasError) {
        this.$emit('save', this.formData)
      } else {
        console.log('formHasError: ', this.formHasError)
      }
    },
    pullFromTemplate (index) {
      const template = this.gameTemplates[index]
      this.formData = {
        structure: template.structure,
        type: template.type,
        buyIn: template.defaults.buyIn,
        rebuy: template.defaults.rebuy,
        addOn: template.defaults.addOn,
        seasonTournament: template.seasonTournament,
        location: template.defaults.location,
        notes: template.defaults.notes,
        gameTime: '7:00 PM'
      }
    }
  },

  directives: {
    selectAll
  },
  mounted () {
    if (this.game) {
      if (this.game.gameDate) {
        const gameDate = date.formatDate(this.game.gameDate.toDate(), 'MM/DD/YYYY')
        const gameTime = date.formatDate(this.game.gameDate.toDate(), 'hh:mm a')
        this.formData = {
          structure: this.game.structure,
          type: this.game.type,
          gameDate: gameDate,
          gameTime: gameTime,
          buyIn: this.game.buyIn,
          rebuy: this.game.rebuy,
          addOn: this.game.addOn,
          seasonTournament: this.game.seasonTournament,
          location: this.game.location,
          notes: this.game.notes,
          id: this.id
        }
      }
    } else {
      this.formData.gameTime = '7:00 pm'
    }
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
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 5rem 7rem 5rem 5rem 12rem 17rem;

        .attribute-container.structure {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
        }

        .attribute-container.date {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .attribute-container.buy-in {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        .attribute-container.location {
          max-height: 11rem;
          .q-textarea {
            max-height: 10rem;
          }
        }

        .q-field__input {
          font-size: 16px
        }

      }

      .label {
        font-size: 20px;
        margin: 12px 0px 8px 0px;
      }
      .q-input {
        max-width: 90%;
      }
    }
  }
</style>
