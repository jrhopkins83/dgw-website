<template>
  <div class="col player-form">

    <q-card class="add-player">
      <q-card-section>
        <modal-header>{{ heading }}</modal-header>
        <q-form
          ref="playerForm"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6 q-pa-sm">
              <q-input
                ref="first"
                v-model="formData.firstName"
                lazy-rules
                label="First Name"
                stack-label
                clearable
                clear-icon="close"
                outlined
                id="firstName"
                :rules="[required]"
              />
            </div>
            <div class="col-12 col-md-6 q-pa-sm">
              <q-input
                ref="last"
                v-model="formData.lastName"
                label="Last Name"
                stack-label
                clearable
                clear-icon="close"
                outlined
                id="lastName"
                lazy-rules
                :rules="[required]"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-10 q-pa-sm">
              <q-input
                ref="email"
                type="email"
                v-model="formData.email"
                lazy-rules
                clearable
                clear-icon="close"
                outlined
                class="col"
                label="Email"
                stack-label
                :rules="[email]"
              />
            </div>
          </div>
          <div class="row">
            <div class="q-pa-sm">
              <q-input
                ref="phone"
                type="tel"
                v-model="formData.phoneNumber"
                lazy-rules
                clearable
                clear-icon="close"
                outlined
                class="col"
                label="Phone Number"
                stack-label
                mask="(###) ### - ####"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6 q-pa-sm">
              <q-input
                ref="nickName"
                v-model="formData.nickName"
                label="Nick Name"
                stack-label
                clearable
                clear-icon="close"
                outlined
                id="nickName"
              />
            </div>
            <div class="col-12 col-md-6 q-pa-sm">
              <q-input
                ref="onlineName"
                v-model="formData.onlineName"
                label="Online Name"
                stack-label
                clearable
                clear-icon="close"
                outlined
                id="onlineName"
              />
            </div>
          </div>
          <div class="q-ml-sm q-my-md">
            <div class="q-gutter-sm">
              <q-checkbox
                v-model="formData.emailOptin"
                color="blue-7"
                label="Receive email communications"
              />
            </div>
            <!-- TO-DO: Uncomment when SMS functionality added -->
            <!-- <div class="q-gutter-sm">
              <q-checkbox
                v-model="formData.notificationOptin"
                color="blue-7"
                label="Receive SMS texts"
              />
            </div> -->
          </div>
        </q-form>

        <q-card-actions align="center">
          <q-btn
            label="Submit"
            color="blue-9"
            @click="submitForm"
          />

          <q-btn
            label="Cancel"
            color="primary"
            @click="$emit('close')"
          />
        </q-card-actions>

      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import formMixin from 'src/mixins/form'
import { selectAll } from 'src/directives/directive-select-all'
// import { email, required, maxValue } from 'vuelidate/lib/validators'
import { email, required, phone } from 'src/utils/validators'
import { toTitleCase } from 'src/functions/functions-common'

export default {
  mixins: [formMixin],
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default
  },
  props: {
    player: {
      type: Object
    },
    heading: String,
    mode: String
  },
  data () {
    return {
      name,
      formData: {
        firstName: null,
        lastName: null,
        onlineName: null,
        nickName: null,
        email: null,
        phoneNumber: null,
        emailOptin: null,
        notificationOptin: null
      },
      playerToSubmit: {},
      validation: false
    }
  },
  computed: {

  },
  methods: {
    email,
    required,
    phone,
    async submitForm () {
      this.$refs.first.validate()
      this.$refs.last.validate()
      this.$refs.email.validate()

      // if (this.$v.$invalid) {
      //   this.$nextTick(() => this.focusFirstStatus())
      if (this.$refs.first.hasError || this.$refs.last.hasError || this.$refs.email.hasError) {
        this.formHasError = true
      }

      let nickName = null
      let onlineName = null

      if (!this.formHasError) {
        if (this.formData.nickName) {
          nickName = this.formData.nickName.trim()
        }

        if (this.formData.onlineName) {
          onlineName = this.formData.onlineName.trim()
        }

        this.playerToSubmit = {
          firstName: toTitleCase(this.formData.firstName).trim(),
          lastName: toTitleCase(this.formData.lastName).trim(),
          email: this.formData.email,
          phoneNumber: this.formData.phoneNumber,
          nickName: nickName,
          onlineName: onlineName,
          emailOptin: this.formData.emailOptin,
          notificationOptin: this.formData.notificationOptin
        }

        this.$emit('submit', this.playerToSubmit)
      }
    }
  },
  directives: {
    selectAll
  },
  mounted () {
    if (this.player) {
      this.formData = Object.assign({}, this.player)
    } else {
      this.formData.emailOptin = true
      this.formData.notificationOptin = true
    }
  }

}
</script>

<style lang="scss" scoped>
  .col.player-form {
    display: flex;
    justify-content: center;
  }
  .q-card.add-player {
    max-width: 75vw;
    width:40vw;
    // height:150px;

    .q-input {
      max-width: 90%;
    }
  }
</style>
