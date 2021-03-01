<template>
  <div class="col player-form">

    <q-card class="add-player">
      <q-card-section>
        <modal-header
          @close="$emit('close')"
        >
        {{ heading }}
        </modal-header>
        <q-form
          ref="playerForm"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6 q-pa-sm">
              <q-input
                ref="first"
                v-model="localPlayer.firstName"
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
                v-model="localPlayer.lastName"
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
                v-model="localPlayer.email"
                @change="checkUserId"
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
                v-model="localPlayer.phoneNumber"
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
                v-model="localPlayer.nickName"
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
                v-model="localPlayer.onlineName"
                label="Online Name"
                stack-label
                clearable
                clear-icon="close"
                outlined
                id="onlineName"
              />
            </div>
          </div>
          <div class="q-ml-sm q-my-md" v-if="localPlayer.email">
            <div class="q-gutter-sm">
              <q-checkbox
                v-model="localPlayer.emailOptin"
                color="blue-7"
                label="Receive email communications"
              />
            </div>
          </div>
        </q-form>

      </q-card-section>

    </q-card>
  </div>
</template>

<script>
import formMixin from 'src/mixins/form'
import { selectAll } from 'src/directives/directive-select-all'
import { email, required, phone } from 'src/utils/validators'

export default {
  mixins: [formMixin],
  components: {
    modalHeader: require('components/Modals/Shared/ModalHeader.vue').default
  },
  props: {
    value: {
      type: Object
    },
    heading: String,
    mode: String,
    createUser: Boolean
  },
  data () {
    return {
      noEmail: true,
      noUserId: false
    }
  },
  computed: {
    localPlayer: {
      get () {
        return this.value
      },
      set (container) {
        this.$emit('input', container)
      }
    }
  },
  methods: {
    email,
    required,
    phone,
    async checkUserId () {
      this.$refs.email.validate()
      if (this.noEmail && !this.$refs.email.hasError) {
        this.$emit('update:createUser', true)
      }
    }
  },
  directives: {
    selectAll
  },
  mounted () {
    if (this.value) {
      this.createUser = false
      if (this.value.email) {
        this.noEmail = false
      }
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
