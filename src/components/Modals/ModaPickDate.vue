<template>
  <div class="row q-mb-sm">
    <q-input
      ref="pickDate"
      outlined
      disabled
      :rules="[required]"
      :value="pickDate"
      @input="$emit('update:pickDate', $event)"
    >
      <template v-slot:append>
        <q-icon
          v-if="pickDate"
          dense
          @click="$emit('clear')"
          :rules="[required]"
          name="close"
          class="cursor-pointer"
        />
        <q-icon
          name="event"
          color="blue"
          class="cursor-pointer"
        >
          <q-popup-proxy v-model="showPicker">
            <q-date
              :value="pickDate"
              minimal
              :rules="[required]"
              :options="optionsFn"
              mask="ddd D MMM, YYYY"
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
const { addToDate, formatDate } = date

export default {
  props: ['pickDate'],
  data () {
    return {
      showPicker: false,
      currDate: new Date().toLocaleDateString()
    }
  },
  computed: {
    txtCurrDate: function () {
      const currDate = new Date()
      return formatDate(currDate, 'YYYY/MM/DD')
    },
    txtEndDate: function () {
      const endDate = addToDate(new Date(), { days: 0, month: 2 })
      return formatDate(endDate, 'YYYY/MM/DD')
    }
  },
  methods: {
    required,
    closeDialog (event) {
      this.$emit('update:pickDate', event)
      this.showPicker = false
    },
    optionsFn (date) {
      return date >= this.txtCurrDate && date <= this.txtEndDate
      // return date >= '08-12-2020' && date <= '09-11-2020'
    }
  }
}
</script>
