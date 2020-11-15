<template>
  <div class="q-pa-sm">
    <template v-if="eventLoaded">
      <q-form class="q-gutter-sm">
        <q-card class="my-card q-pa-sm">
          <q-card-section class="q-px-sm q-py-xs">
            <div class="row">
              <div class="col-2 text-subtitle2 q-py-md">Event</div>
              <div class="col-10">
                <q-input
                  class="input-field"
                  ref="name"
                  v-model="eventToSubmit.name"
                  lazy-rules
                  clearable
                  clear-icon="close"
                  outlined
                  id="name"
                  :rules="[required]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-2 text-subtitle2 q-py-md">Host</div>
              <div class="col-10">
                <q-input
                  class="input-field"
                  ref="host"
                  v-model="eventToSubmit.host"
                  lazy-rules
                  clearable
                  clear-icon="close"
                  outlined
                  id="host"
                  :rules="[required]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-2 text-subtitle2 q-py-md">Phone</div>
              <div class="col-10">
                <q-input
                  class="input-field"
                  ref="phone"
                  v-model="eventToSubmit.contactPhone"
                  lazy-rules
                  clearable
                  clear-icon="close"
                  outlined
                  id="phone"
                  mask="(###) ### - ####"
                  fill-mask
                  :rules="[required]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-2 text-subtitle2 q-py-md">Date</div>
              <div class="col-10 q-py-md">
                <div>{{ eventDate }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-subtitle2 q-py-md">Start Time</div>
              <div class="col-2">
                <q-input
                  class="input-field text-right"
                  ref="startHour"
                  v-model="startHour"
                  lazy-rules
                  outlined
                  id="startHour"
                  type="number"
                  style="max-width: 75px"
                  :rules="[required]"
                />
              </div>
              <div class="q-py-md q-mx-sm"> : </div>
              <div class="col-2">
                <q-input
                  class="input-field"
                  ref="startMinute"
                  v-model="startMinute"
                  lazy-rules
                  outlined
                  id="startMinute"
                  type="number"
                  style="max-width: 75px"
                  :rules="[required]"
                />
              </div>
              <div class="q-py-md">
                <q-btn-toggle
                  v-model="startAM_PM"
                  class="my-custom-toggle"
                  no-caps
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  style="max-width: 200px"
                  size="sm"
                  :options="[
                      {label: 'AM', value: 'am'},
                      {label: 'PM', value: 'pm'}
                    ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-subtitle2 q-py-md">End Time</div>
              <div class="col-2">
                <q-input
                  class="input-field"
                  ref="endHour"
                  v-model="endHour"
                  lazy-rules
                  outlined
                  id="endHour"
                  type="number"
                  style="max-width: 75px"
                  :rules="[required]"
                />
              </div>
              <div class="q-py-md q-mx-sm"> : </div>
              <div class="col-2">
                <q-input
                  class="input-field"
                  ref="endMinute"
                  v-model="endMinute"
                  lazy-rules
                  outlined
                  id="endMinute"
                  type="number"
                  style="max-width: 75px"
                  :rules="[required]"
                />
              </div>
              <div class="q-py-md">
                <q-btn-toggle
                  v-model="startAM_PM"
                  class="my-custom-toggle"
                  no-caps
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  style="max-width: 200px"
                  size="sm"
                  :options="[
                      {label: 'AM', value: 'am'},
                      {label: 'PM', value: 'pm'}
                    ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-2 text-subtitle2">Where</div>
              <div class="col-10">
                <div> {{ location }}</div>
                <div>{{ address }}</div>
                <div>{{ city }}, {{ state}} {{ zip }}</div>
              </div>
            </div>
            <div class="row">
              <div class="text-subtitle2 q-py-md">Host Comments</div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input
                  class="input-field"
                  ref="hostComments"
                  v-model="eventToSubmit.hostComments"
                  lazy-rules
                  clearable
                  clear-icon="close"
                  outlined
                  type="textarea"
                  id="hostComments"
                />
              </div>
            </div>
          </q-card-section>
          <q-card-actions
            class="q-mb-sm justify-evenly"
            align="center"
          >
            <q-btn
              color="primary"
              label="Send Invite"
              @click="saveSend"
            />
          </q-card-actions>
        </q-card>
      </q-form>
    </template>
  </div>
</template>

<script>
import { required } from 'src/utils/validators'
import { firebaseStore, Timestamp } from 'boot/firebase'
import { showMessage } from 'src/functions/functions-common'
// import { showMessage, calcCourseHcp } from 'src/functions/functions-common'
import { date } from 'quasar'
// import { required } from 'vuelidate/lib/validators'

export default {
  // mixins: [validationMixin],
  // mixins: [formMixin],
  props: ['LeagueInfo', 'nextDate'],
  components: {

  },
  data () {
    return {
      eventLoaded: false,
      eventToSubmit: {
        id: null,
        name: null,
        host: null,
        contactPhone: null,
        startDateTime: null,
        endDateTime: null,
        hostComments: ''
      },
      startHour: null,
      startMinute: null,
      startAM_PM: null,
      endHour: null,
      endMinute: null,
      endAM_PM: null,
      location: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      invitesSent: null,
      invitesCreated: null
    }
  },
  computed: {
    eventDate: function () {
      const startDateTm = this.eventToSubmit.startDateTime.toDate()
      return date.formatDate(startDateTm, 'dddd MM/DD/YYYY')
    },
    txtNextDate: function () {
      return date.formatDate(this.LeagueInfo.currLeagueDate.toDate(), 'MM/DD/YYYY')
    }
  },
  methods: {
    required,
    async onSubmit () {
      this.$refs.teeBox.validate()

      if (this.$refs.teeBox.hasError) {
        this.formHasError = true
      } else {

      }
    },
    onReset () {

    },
    async getEvent () {
      const leagueID = this.LeagueInfo.id
      const nextDate = this.nextDate
      const txtNextDateStart = this.txtNextDate + ' 00:00:00'
      const nextDateStart = Timestamp.fromDate(new Date(txtNextDateStart))
      const txtNextDateEnd = this.txtNextDate + ' 23:59:59'
      const nextDateEnd = Timestamp.fromDate(new Date(txtNextDateEnd))
      // try {
      const eventSnap = await firebaseStore.collection('events')
        .where('leagueID', '==', leagueID)
        .where('startDateTime', '>=', nextDateStart)
        .where('startDateTime', '<=', nextDateEnd)
        .get()
      if (!eventSnap.empty) {
        eventSnap.forEach(doc => {
          this.eventToSubmit.id = doc.id
          if (doc.data().inviteSent) {
            this.eventToSubmit.name = `Reminder, upcoming: ${doc.data().name}`
          } else {
            this.eventToSubmit.name = doc.data().name
          }
          this.eventToSubmit.host = doc.data().host
          this.eventToSubmit.contactPhone = this.LeagueInfo.contactPhone
          this.eventToSubmit.startDateTime = doc.data().startDateTime
          this.eventToSubmit.endDateTime = doc.data().endDateTime
          this.eventToSubmit.hostComments = doc.data().hostComments
          this.location = doc.data().location
          this.address = doc.data().address
          this.city = doc.data().city
          this.state = doc.data().state
          this.zip = doc.data().zip
          this.invitesSent = doc.data().invitesSent
          this.invitesCreated = doc.data().invitesCreated
        })
        if (this.eventToSubmit.startDateTime && this.invitesCreated) {
          const startDateTm = this.eventToSubmit.startDateTime.toDate()
          this.startHour = startDateTm.getHours()
          this.startMinute = startDateTm.getMinutes()

          if (this.startHour >= 12) {
            this.startHour -= 12
            this.startAM_PM = 'pm'
          } else { this.startAM_PM = 'am' }
        } else {
          this.startHour = 5
          this.startMinute = 30
          this.startAM_PM = 'pm'
        }

        if (this.eventToSubmit.endDateTime && this.invitesCreated) {
          const endDateTm = this.eventToSubmit.endDateTime.toDate()
          this.endHour = endDateTm.getHours()
          this.endMinute = endDateTm.getMinutes()

          if (this.endHour >= 12) {
            this.endHour -= 12
            this.endAM_PM = 'pm'
          } else { this.endAM_PM = 'am' }
        } else {
          this.endHour = 8
          this.endMinute = 30
          this.endAM_PM = 'pm'
        }
        this.eventLoaded = true
      } else {
        showMessage('Unable to get the event data for ', nextDate)
      }
      // } catch (error) {
      //   showMessage('error', `Error getting event data for ${nextDate}: ${error.message}`)
      //   this.updating = false
      // }
    },
    async saveSend () {
      try {
        this.startHour = parseInt(this.startHour)
        this.endHour = parseInt(this.endHour)
        if (this.startAM_PM === 'pm') {
          this.startHour = this.startHour + 12
        }
        const dateStartDate = this.eventToSubmit.startDateTime.toDate()
        const startTime = `${this.startHour}:${this.startMinute}`
        const txtStartDateTime = `${dateStartDate.toLocaleDateString()} ${startTime}`
        const startDateTime = Timestamp.fromDate(new Date(txtStartDateTime))
        this.eventToSubmit.startDateTime = startDateTime

        if (this.endAM_PM === 'pm') {
          this.endHour = this.endHour + 12
        }
        const dateendDate = this.eventToSubmit.endDateTime.toDate()
        const endTime = `${this.endHour}:${this.endMinute}`
        const txtendDateTime = `${dateendDate.toLocaleDateString()} ${endTime}`
        const endDateTime = Timestamp.fromDate(new Date(txtendDateTime))
        this.eventToSubmit.endDateTime = endDateTime

        const eventRef = firebaseStore.collection('events').doc(this.eventToSubmit.id)
        await eventRef.update({
          name: this.eventToSubmit.name,
          host: this.eventToSubmit.host,
          contactPhone: this.eventToSubmit.contactPhone,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          hostComments: this.eventToSubmit.hostComments
        })
        showMessage('Info', 'Invites should be sent.  Check logs')
        this.$router.push('/league-info')
      } catch (error) {
        showMessage('error', `Error saving event data for ${this.nextDate}: ${error.message}`)
      }
    }
  },
  beforeMount () {
    this.getEvent()
  }
}
</script>

<style scoped>
.input-field {
  font-size: 1rem;
  line-height: 1rem;
}
.my-custom-toggle {
  border: 1px solid #027be3;
}
</style>
