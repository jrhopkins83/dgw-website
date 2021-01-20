<template>
  <div class="row">
    <q-input
      ref="pickDate"
      outlined
      disabled
      bg-color="white"
      :rules="[required]"
      :value="pickDate"
    >
      <template v-slot:append>
        <q-icon
          name="event"
          color="grey-8"
          class="cursor-pointer"
        >
          <q-popup-proxy v-model="showPicker">
            <q-date
              :value="pickDate"
              minimal
              :rules="[required]"
              :options="completedDates"
              mask="MM/DD/YYYY"
              @input="closeDialog($event)"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { required } from 'src/utils/validators'
import { date } from 'quasar'
const { formatDate } = date

export default {
  props: ['pickDate', 'gameDates'],
  data () {
    return {
      showPicker: false,
      currDate: new Date().toLocaleDateString()
    }
  },
  computed: {
    completedDates: function () {
      const dateArrary = []
      this.gameDates.forEach(game => {
        if (game.complete) {
          const completedDate = formatDate(game.gameDate.toDate(), 'YYYY/MM/DD')
          dateArrary.push(completedDate)
        }
      })
      return dateArrary
    }
  },
  methods: {
    required,
    closeDialog (event) {
      this.$emit('updateGameDate', event)
      this.showPicker = false
    }
  }
}
</script>
