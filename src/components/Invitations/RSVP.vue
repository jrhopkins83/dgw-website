<template>
  <div class="q-pa-xs"
    style="max-width: 400px"
  >
    <q-card
      class="my-card q-ml-sm"
      bordered
    >
      <q-card-section class="q-pt-sm">
        <div class="row no-wrap items-center">
          <div class="col ellipsis" v-if="rsvp.response">
            You've responded {{ rsvp.response }}.
            Change if you need to.
          </div>
          <div class="col ellispsis" v-else>
            You haven't responded yet.
            Will you be there?
          </div>
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section>
        <div class="q-pa-xs"
          style="max-width: 380px"
        >
          <q-form class="q-gutter-sm">
            <div class="col-6 q-mb-sm" v-if="!responded">
              <div class="q-pa-sms">
                <q-card-actions align="around">
                  <q-btn
                    flat
                    dense
                    no-caps
                    stack
                    color="green"
                    size="md"
                    @click="changeRSVP('yes')">
                    <q-icon name="check_circle" size="lg"></q-icon> Yes
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    no-caps
                    stack
                    color="negative"
                    size="md"
                    @click="changeRSVP('no')">
                    <q-icon name="not_interested" size="lg"></q-icon> No
                  </q-btn>
                  <q-btn
                    flat
                    dense
                    no-caps
                    stack
                    color="amber-8"
                    size="md"
                    @click="changeRSVP('maybe')">
                    <q-icon name="help_outline" size="lg"></q-icon> Maybe
                  </q-btn>
                </q-card-actions>
              </div>
            </div>
            <div v-else>

            </div>
          </q-form>
        </div>
      </q-card-section>

    </q-card>

    <q-dialog v-model="showRSVP">
      <q-card class="my-card" style="width: 700px; max-width: 80vw;">

      <q-card-section class="q-pt-sm">
        <div class="row no-wrap items-center">
          <div class="row q-mr-xs">
              {{ rsvp.firstName }} {{ rsvp.lastName }}, you are replying
          </div>
          <div class="row≈">
            <q-avatar
              square
              size="md"
              color="blue"
              text-color="white"
            >
              {{ rsvpUpdate.response }}
            </q-avatar>
          </div>
        </div>
      </q-card-section>

        <template v-if="rsvpUpdate.response!=='no'">

          <q-separator />

          <q-card-section>
            <q-form ref="rsvpForm">
              <div class="">
                Number of Guests
              </div>
              <q-select
                v-model.number="rsvpUpdate.numGuests"
                type="number"
                outlined
                :options="guestOpts"
                style="max-width: 40px"
                class="q-pa-xs"
              />
              <div v-if="rsvpUpdate.numGuests > 0">
                <div>
                  Guest Names
                </div>
                <div>
                  <q-input v-for="n in rsvpUpdate.numGuests" :key="n"
                    class="q-mb-xs"
                    outlined
                    v-model="rsvpUpdate.guestNames[n-1]"
                    default='Guest'
                    type="text"
                    label="First and Last Name"
                  />
                </div>
              </div>

              <q-separator />

              <div>
                Pairing request
              </div>
              <q-input
                outlined
                v-model="rsvpUpdate.pairingRequest"
                  type="text"
              />
              <q-separator />

              <div>
                Comments
              </div>
              <q-input
                outlined
                v-model="rsvpUpdate.comments"
                  type="text"
              />

            </q-form>
          </q-card-section>

        </template>

        <q-separator />

        <q-card-actions>
          <q-btn label="Submit RSVP" color="primary" @click="saveRSVP" />
          <q-btn label="Cancel" color="negative" @click="cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { toTitleCase } from 'src/functions/functions-common'

export default {
  // mixins: [validationMixin],
  // mixins: [formMixin],
  props: ['rsvp'],
  data () {
    return {
      responded: false,
      showRSVP: null,
      guestOpts: [0, 1, 2, 3],
      rsvpUpdate: {
        comments: this.rsvp.comments,
        numGuests: this.rsvp.numGuests,
        guestNames: this.rsvp.guestNames,
        pairingRequest: this.rsvp.pairingRequest,
        response: this.rsvp.response
      }
    }
  },
  computed: {
    // ...mapGetters('leagueSettings', ['LeagueInfo', 'UserInfo', 'devMode', 'leagueDates']),
    // dispResponse: function () {
    //   return toTitleCase(this.rvspUpdate.response)
    // }
  },
  methods: {
    changeRSVP (response) {
      console.log('this.rsvp: ', this.rsvp)
      this.rsvpUpdate.response = response
      if (response === 'no') {
        this.rsvpUpdate.numGuests = 0
        this.rsvpUpdate.guestNames = []
        this.pairingRequest = null
      }
      this.showRSVP = true
    },
    cancel () {
      this.showRSVP = false
      this.rsvpUpdate = this.rsvp
    },
    async saveRSVP () {
      this.showRSVP = false
      const numGuests = this.rsvpUpdate.numGuests
      const numGuestNames = this.rsvpUpdate.guestNames.length
      for (let i = 0; i < this.rsvpUpdate.guestNames.length; i++) {
        this.rsvpUpdate.guestNames[i] = toTitleCase(this.rsvpUpdate.guestNames[i])
      }
      if (numGuestNames < numGuests) {
        for (let i = numGuests - numGuestNames; i <= numGuests - numGuestNames; i++) {
          this.rsvpUpdate.guestNames.push(`${this.rsvp.lastName} Guest`)
        }
      }
      this.$emit('saveRSVP', this.rsvpUpdate)
    }
  },
  beforeMount () {
    // if (this.rsvp.response) {
    //   this.rvspUpdate = this.rsvp
    // }
  }
}
</script>
