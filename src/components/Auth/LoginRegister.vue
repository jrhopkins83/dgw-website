<template>
  <div>
    <div>
      <q-form @submit.prevent="submitForm">
        <div class="row q-mb-sm">
          <q-banner class="bg-grey-3 col">
            <template v-slot:avatar>
              <q-icon
                name="account_circle"
                color="primary"
              />
            </template>
            {{ tab | titleCase }} to access the app!
          </q-banner>
        </div>
        <div v-if="!hideForm">
          <q-card>
            <p
              class="text-negative"
              v-if="message"
            >{{ message }}</p>
            <p
              class="text-negative"
              v-if="LoginError"
            >{{ LoginError.errorMessage }}</p>
            <template v-if="tab != 'login'">
              <div class="q-pa-xs">
                <q-input
                  ref="first"
                  v-model="formData.firstName"
                  label="First Name"
                  stack-label
                  clearable
                  clear-icon="close"
                  outlined
                  id="firstName"
                  lazy-rules
                  :rules="[required]"
                >
                </q-input>
              </div>
              <div class="q-pa-xs">
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
                >
                </q-input>
              </div>
              <div class="row q-pa-xs">
                <div class="col-8">
                  <q-input
                    ref="handicap"
                    v-model="formData.onlineName"
                    stack-label
                    label="Poker Bros Name"
                    clearable
                    clear-icon="close"
                    outlined
                    reverse-fill-mask
                    input-class="text-left"
                  >
                  </q-input>
                </div>
              </div>

              <div class="q-pa-xs">
              </div>
            </template>
            <div class="q-pa-xs">
              <q-input
                ref="email"
                v-model="formData.email"
                type="email"
                lazy-rules
                clearable
                clear-icon="close"
                outlined
                class="col"
                label="Email"
                stack-label
                autocomplete="username"
                :rules="[required, email]"
              />
            </div>
            <div class="row q-mb-md q-pa-xs" v-if="!resetPassword">
              <q-input
                ref="password"
                v-model="formData.password"
                :type="isPwd ? 'password' : 'text'"
                hint="Click the eye to show / hide your password"
                :rules="[ val => val.length >= 6 || 'Please enter at least 6 characters.']"
                lazy-rules
                clearable
                clear-icon="close"
                outlined
                class="col cursor-pointer"
                label="Password"
                autocomplete="current-password"
                stack-label
              >
                <template v-slot:prepend>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div class="row">
              <q-card-actions
                class="q-mb-sm"
                align="around"
              >
                <q-btn
                  v-if="LoginError.errorCode=='auth/too-many-requests' || resetPassword"
                  class="action-button"
                  color="primary"
                  label="Reset Password"
                  @click="sendReset"
                >
                <q-tooltip>
                  Click to send password reset email
                </q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  class="action-button"
                  color="blue-9"
                  :label="tab"
                  type="submit"
                >
                </q-btn>
                <q-checkbox v-if="!resetPassword"
                  v-model="resetPassword"
                  label="First time logging in or forgot password?"
                />
              </q-card-actions>
            </div>
          </q-card>
        </div>
      </q-form>
    </div>
    <div>
      <q-dialog
        v-model="existPrompt"
        persistent
      >
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="person_add"
              color="primary"
              text-color="white"
            />
          </q-card-section>
          <q-card-section>
            <p class="q-ml-sm">{{ dialogMsg }}</p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Yes"
              color="primary"
              @click="registerExistingPlayer"
            />
            <q-btn
              flat
              label="No"
              color="primary"
              @click="registerNewPlayer"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
    <div>
      <q-dialog
        v-model="codePrompt"
        persistent
      >
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Enter the league authorization code</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              v-model="leagueCode"
              autofocus
              @keyup="invalidCode = false"
            />
          </q-card-section>
          <q-card-section>
            <p class="text-negative" v-if="invalidCode">
              {{ codeMsg }}
            </p>
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-primary"
          >
            <q-btn
              color="secondary"
              label="Cancel"
              v-close-popup
            />
            <q-btn
              type="submit"
              color="primary"
              label="OK"
              @click.prevent="validateCode"
              v-if="codeAttempts < 5"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import { email, required, minLength } from 'vuelidate/lib/validators'
import { email, required } from 'src/utils/validators'
import { selectAll } from 'src/directives/directive-select-all'
import { mixinAddEditPlayer } from 'src/mixins/mixin-add-edit-player'
import formMixin from 'src/mixins/form'
import { toTitleCase } from 'src/functions/functions-common'

export default {
  name: 'LoginRegister',
  props: ['tab'],
  mixins: [mixinAddEditPlayer, formMixin],
  data () {
    return {
      isPwd: true,
      formData: {
        firstName: null,
        lastName: null,
        email: '',
        password: ''
      },
      existPrompt: false,
      existPlayer: false,
      dialogMsg: '',
      message: '',
      resetPassword: false,
      newUser: {},
      validation: false,
      hideForm: false,
      codePrompt: false,
      leagueCode: null,
      invalidCode: false,
      codeAttempts: 0,
      codeMsg: 'Invalid code. Try again'
    }
  },
  computed: {
    ...mapGetters('auth', ['LoginError'])
  },
  methods: {
    ...mapActions('auth', ['loginUser', 'setNewUser', 'sendReset']),
    email,
    required,
    async submitForm () {
      // this.$v.$touch()
      // if (this.$v.$invalid) {
      //   this.$nextTick(() => this.focusFirstStatus())
      // } else {

      this.newUser.leagueID = this.leagueID
      this.newUser.primaryEmail = this.formData.email.trim()
      this.newUser.password = this.formData.password.trim()

      if (this.$refs.email.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      }

      if (window.location.hostname === 'localhost') {
        this.formHasErr = false
      }

      if (this.tab === 'login' && !this.formHasError) {
        this.loginUser(this.formData)
      } else if (this.tab === 'register') {
        this.$refs.last.validate()
        this.$refs.first.validate()
        if (this.$refs.first.hasError || this.$refs.last.hasError) {
          this.formHasError = true
        }
        if (!this.formHasError) {
          // Get league verification code and lookup
          this.codePrompt = true
        }
      }
      // }
    },
    async validateCode () {
      this.codePrompt = false
      const code = this.leagueCode.trim()
      this.formData.leagueID = await this.lookupLeagueCode(code)
      if (this.formData.leagueID) {
        this.newUser.leagueID = this.formData.leagueID
        this.newUser.firstName = toTitleCase(this.formData.firstName).trim()
        this.newUser.lastName = toTitleCase(this.formData.lastName).trim()

        let fullHandicap = 0
        if (!Number.isNaN(this.formData.fullHandicap)) {
          fullHandicap = null
        } else {
          fullHandicap = parseFloat(fullHandicap.toFixed(1))
        }

        this.newUser.fullHandicap = fullHandicap
        this.registerPlayer(this.newUser)
      } else {
        this.codeAttempts++
        if (this.codeAttempts === 5) {
          this.codeMsg = "Looks like you don't have the correct code. Contact one of your league coordinators."
        }
        this.invalidCode = true
        this.codePrompt = true
      }
    },
    sendReset () {
      this.sendReset(this.formData.email)
      this.resetPassword = false
      this.formData.email = ''
    }

  },
  directives: {
    selectAll
  },
  filters: {
    titleCase (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .q-banner__content.text-body2 {
    font-size: 1.6rem;
  }
  .action-button {
    margin-right: 15rem;
  }
</style>
