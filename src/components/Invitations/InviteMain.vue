<template>
  <div>
    <q-card class="q-pa-xs">
      <q-splitter
        v-model="splitterModel"
        unit="px"
        style="height: auto"
      >

        <template v-slot:before>
          <q-tabs
            v-model="tab"
            vertical
            indicator-color="transparent"
            active-bg-color="blue"
            active-color="white"
            class="text-blue-7 shadow-2"
          >
            <q-tab name="rsvp" icon="how_to_reg" label="RSVP"/>
            <q-tab name="guests" icon="people" label="Guests"/>
            <q-tab name="comments" icon="event_note" label="Activity"/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="rsvp" class="q-pa-none">
              <rsvp
                :rsvp="rsvp"
                @saveRSVP="saveRSVP"
              >
              </rsvp>
            </q-tab-panel>

            <q-tab-panel name="guests" class="q-pa-none">
              <p>Guest list component goes here</p>
            </q-tab-panel>

            <q-tab-panel name="comments" class="q-pa-none">
              <p>Comments component goes here</p>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>
    </q-card>
  </div>
</template>

<script>
import { showMessage } from 'src/functions/functions-common'
import { firebaseStore } from 'src/boot/firebase'

export default {
  props: ['invitation'],
  components: {
    rsvp: require('components/Invitations/RSVP.vue').default
  },
  data () {
    return {
      tab: 'rsvp',
      splitterModel: 75,
      rsvp: {
        id: this.invitation.id,
        firstName: this.invitation.firstName,
        lastName: this.invitation.lastName,
        response: this.invitation.response,
        numGuests: this.invitation.numGuests,
        guestNames: this.invitation.guestNames,
        pairingRequest: this.invitation.pairingRequest,
        comments: this.invitation.comments
      }
    }
  },
  methods: {
    async saveRSVP (rsvpUpdate) {
      console.log('rsvpUpdate: ', rsvpUpdate)
      const invitationRef = firebaseStore.collection('invitations').doc(this.rsvp.id)
      try {
        await invitationRef.update(rsvpUpdate)
        showMessage('Information', 'RSVP submitted')
        this.rsvp.response = rsvpUpdate.response
        this.rsvp.numGuests = rsvpUpdate.numGuests
        this.rsvp.guestNames = rsvpUpdate.guestNames
        this.rsvp.pairingRequest = rsvpUpdate.pairingRequest
        this.rsvp.comments = rsvpUpdate.comments
      } catch (error) {
        showMessage('Error', `Error saving your update. ${error.message}`)
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .q-tab__label {
    font-size: 10px
  }
  .q-splitter__before {
    width: 30%;
  }
</style>
