<template>
  <div
    class="q-pa-xs"
    style="max-width: 400px"
  >
    <q-form
      ref="nextDtForm"
      v-if="coursesLoaded"
      class="q-gutter-md"
    >
      <q-card class="my-card">
        <q-card-section class="q-pa-xs">
          <div class="text-subtitle1 text-weight-bold text-center">Set League Date</div>
        </q-card-section>

      <q-separator />
        <q-card-section class="q-pa-sm">
          <div class="row">
            <div class="col-12 text-subtitle2">{{ cardHeader1}}</div>
          </div>
        </q-card-section>
        <q-card-section class="q-px-sm q-py-xs">
          <div class="row">
            <div class="col-8 text-subtitle2">{{ cardHeader2 }}</div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-8" >
            <modal-pick-date
              :pickDate.sync="dateToSubmit.pickDate"
              @clear="clearPickDate"
            />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-px-sm q-py-xs" v-if="courses.length > 1">
          <div class="row">
            <modal-pick-course v-if="courses.length > 0"
              :courses="courses"
              :course.sync="dateToSubmit.courseID"
            />
          </div>
        </q-card-section>
          <q-card-actions
            class="q-mb-sm justify-evenly"
            align="center"
          >
            <q-btn
              color="primary"
              label="Update"
              @click="confirm = true"
            />
            <q-btn
              v-if="currentLeagueDate > today"
              color="primary"
              label="Send Invite"
              @click="invite = true"
            />
        </q-card-actions>
      </q-card>
      <q-dialog
        v-model="confirm"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Confirm next date:</div>
            <div class="text-subtitle1">{{txtNextDate}}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Setting the date for the next event will also update season scores and handicaps.

            Proceed?
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn label="OK" color="primary" @click="onSubmit" />
            <q-btn label="Cancel" color="negative" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="invite"
      >
        <q-card style="width: 700px; max-width: 80vw;">
          <q-card-section>
            <div class="text-h6">Do you want to send invites for {{txtCurrDate}}?</div>
            <div class="text-subtitle1"></div>
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn label="Yes" color="primary" @click="openInvite" />
            <q-btn label="No" color="negative" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-inner-loading :showing="updating">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-form>
  </div>
</template>

<script>
import { firebaseStore, Timestamp } from 'boot/firebase'
import commonFunctions from 'src/mixins/mixin-common-functions'
import { showMessage } from 'src/functions/functions-common'
import { date } from 'quasar'

import { mapGetters } from 'vuex'

export default {
  mixins: [commonFunctions],
  components: {
    'modal-pick-date': require('src/components/Modals/ModaPickDate.vue').default,
    'modal-pick-course': require('src/components/Modals/ModalSelectCourse.vue').default
  },
  data () {
    return {
      dateToSubmit: {
        leagueID: '',
        pickDate: '',
        courseID: ''
      },
      prevDate: null,
      nextDate: null,
      course: {},
      courses: [],
      coursesLoaded: false,
      confirm: false,
      updating: false,
      invite: false
    }
  },
  computed: {
    ...mapGetters('leagueSettings', ['LeagueInfo', 'leagueDates', 'leagueCourses']),
    lastRoundDt: function () {
      return this.leagueDates[0].txtRoundDt
    },
    txtCurrDate: function () {
      return date.formatDate(this.LeagueInfo.currLeagueDate.toDate(), 'MM/DD/YYYY')
    },
    txtNextDate: function () {
      return date.formatDate(this.dateToSubmit.pickDate, 'dddd MM/DD/YYYY')
    },
    showCourses: function () {
      if (this.courses.length > 0) {
        return true
      } else {
        return false
      }
    },
    cardHeader1: function () {
      return 'Current League Date ' + this.txtCurrDate
    },
    cardHeader2: function () {
      if (this.courses.length > 1) {
        return 'Select next league date and course'
      } else {
        return 'Select next league date'
      }
    },
    today () {
      return new Date()
    },
    currentLeagueDate: function () {
      return this.LeagueInfo.currLeagueDate.toDate()
    }
  },
  methods: {
    // ...mapActions('leagueSettings', ['addLeagueDate']),
    async onSubmit () {
      this.confirm = false
      this.updating = true
      this.$refs.nextDtForm.validate().then(async success => {
        if (success) {
          try {
            await this.addNewDate()
            this.clearPickDate()
            this.$refs.nextDtForm.resetValidation()
            this.updating = false
            this.invite = true
          } catch (error) {
            showMessage('error', `Error setting league date, error: ${error.message}`)
            this.updating = false
          }
        // TO-DO: Update handicaps
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })

      // to reset validations:
      this.$refs.nextDtForm.resetValidation()
    },
    clearPickDate () {
      this.dateToSubmit.pickDate = ''
    },
    getCourses () {
      try {
        this.leagueCourses.forEach(async (course) => {
          const courseRef = firebaseStore.collection('golfCourses').doc(course.courseID)
          const doc = await courseRef.get()
          const courseData = {
            courseID: doc.id,
            courseName: doc.data().courseName
          }
          this.courses.push(courseData)
        })
        this.coursesLoaded = true
      } catch (error) {
        showMessage('error', `Error getting course info, error: ${error}`)
        // this.coursesLoaded = true
      }
    },
    async addNewDate () {
      const pickDate = this.dateToSubmit.pickDate + ' 12:00:00'
      this.nextDate = Timestamp.fromDate(new Date(pickDate))
      const txtRoundDt = date.formatDate(this.nextDate.toDate(), 'MM/DD/YYYY')
      if (this.courses.length === 1) {
        this.dateToSubmit.courseID = this.courses[0].courseID
      }
      if (!this.dateToSubmit.courseID) {
        this.dateToSubmit.courseID = this.LeagueInfo.defaultCourse
      }
      const newDate = {
        leagueID: this.LeagueInfo.id,
        roundDt: this.nextDate,
        txtRoundDt: txtRoundDt,
        courseID: this.dateToSubmit.courseID
      }
      this.prevDate = this.LeagueInfo.currLeagueDate
      const dtAdded = await this.addNewLeagueDate(newDate)
      if (typeof (dtAdded) !== 'object') {
        showMessage(dtAdded)
      }
      this.updateLeagueInfo(this.prevDate, this.nextDate)

      const newEvent = {
        leagueID: this.LeagueInfo.id,
        nextDate: this.nextDate,
        courseID: this.dateToSubmit.courseID
      }
      await this.createNewEvent(newEvent)
      this.invite = true
    },
    async addNewLeagueDate (newDate) {
      const collection = 'leagueDates'
      try {
        return await this.addObjectToFS(newDate, collection)
      } catch (err) {
        return showMessage('Error', 'Error updating new date')
      }
    },
    async updateLeagueInfo (prevDate, nextDate) {
      const leagueRef = firebaseStore.collection('leagueInfo').doc(this.LeagueInfo.id)
      try {
        await leagueRef.update({
          prevLeagueDate: this.prevDate,
          currLeagueDate: this.nextDate
        })
      } catch (err) {
        showMessage('Error', `Error, ${err} updating league info`)
      }
    },
    async createNewEvent (newDate) {
      try {
        const eventNumber = this.leagueDates.length
        const eventName = `${this.LeagueInfo.leagueName} Week ${eventNumber}`
        const host = this.LeagueInfo.leagueNameShort
        const courseInfo = await this.getCourseInfo(newDate.courseID)
        const newEvent = {
          leagueID: newDate.leagueID,
          name: eventName,
          host: host,
          location: courseInfo.courseName,
          address: courseInfo.streetAddress,
          city: courseInfo.city,
          state: courseInfo.state,
          zip: courseInfo.zip,
          startDateTime: newDate.nextDate,
          endDateTime: newDate.nextDate,
          hostComments: null,
          invitesCreated: false,
          invitesSent: 0
        }
        const eventsRef = firebaseStore.collection('events')
        return await eventsRef.add(newEvent)
      } catch (err) {
        showMessage('Error', `Error, ${err} creating new event`)
        return err
      }
    },
    async getCourseInfo (courseID) {
      const courseRef = firebaseStore.collection('golfCourses').doc(courseID)
      try {
        const doc = await courseRef.get()
        if (doc.exists) {
          return doc.data()
        } else { return 'Error getting course info' }
      } catch (err) {
        return `Error getting course info ${err}`
      }
    },
    openInvite () {
      this.$router.push('/send-invite').catch((err) => {
        showMessage('error', `Problem handling something: ${err}.`)
      })
    }
  },
  created () {
    this.getCourses()
  }
}
</script>
