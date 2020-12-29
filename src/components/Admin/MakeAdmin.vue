<template>
  <div
    class="q-pa-xs"
    style="max-width: 400px"
  >
    <q-card class="my-card">
      <q-card-section class="q-pa-xs">
        <div class="text-subtitle1 text-weight-bold text-center">Make League Admin</div>
      </q-card-section>

      <q-separator />
        <q-card-section class="q-pa-sm">
        <q-form
          ref="makeAdminForm"
          class="q-gutter-md"
        >
          <q-card class="my-card">
            <q-card-section class="q-pa-xs">
              <div class="row">
                <div class="col-12 text-subtitle2">Enter the email for the person to make admin then click the button</div>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-xs">
              <q-input
                ref="email"
                v-model="adminEmail"
                lazy-rules
                clearable
                clear-icon="close"
                outlined
                class="col"
                label="Email"
                stack-label
                :rules="[email, required]"
              />
            </q-card-section>
            <q-card-actions
              class="q-mb-xs justify-evenly"
              align="center"
            >
              <q-btn
                color="amber-8"
                label="Make Admin"
                @click="onSubmit"
              />
            </q-card-actions>
          </q-card>
          <q-inner-loading :showing="updating">
            <q-spinner-gears
              size="50px"
              color="primary"
            />
          </q-inner-loading>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { firebaseFunctions } from 'boot/firebase'
import commonFunctions from 'src/mixins/mixin-common-functions'
import { showMessage } from 'src/functions/functions-common'
import { email, required } from 'src/utils/validators'
import { mapGetters } from 'vuex'

export default {
  mixins: [commonFunctions],
  components: {

  },
  data () {
    return {
      adminEmail: null,
      updating: false
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['userInfo'])
  },
  methods: {
    email,
    required,
    async onSubmit () {
      this.$refs.email.validate()
      if (this.$refs.email.hasError) {
        this.formHasError = true
      }
      if (!this.formHasError) {
        try {
          const addAdminRole = firebaseFunctions.httpsCallable('setAdminClaim')
          addAdminRole({ email: this.adminEmail, playerID: this.userInfo.playerID }).then(result => {
            this.clearEmail()
            const msg = result.data.message
            console.log(msg)
            showMessage(msg)
          })
        } catch (error) {
          showMessage('error', `Error making admin, error: ${error.message}`)
          this.updating = false
        }
        // TO-DO: Update handicaps
      } else {
        // oh no, user has filled in
        // at least one invalid value
      }

      // to reset validations:
      this.$refs.makeAdminForm.resetValidation()
    },
    clearEmail () {
      this.adminEmail = ''
    }
  }
}
</script>
