<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      label="Game date"
      :value="pickDate"
      @input="$emit('update:pickDate', $event)"
    >
      <template v-slot:append>
        <q-icon
          v-if="pickDate"
          @click="$emit('clear')"
          name="close"
          class="cursor-pointer"
        />
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy v-model="showPicker">
            <q-date
              mask="MM/DD/YYYY"
              minimal
              :value="pickDate"
              @input="closeDialog($event)"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  props: ['pickDate'],
  data () {
    return {
      showPicker: false
    }
  },
  methods: {
    closeDialog (event) {
      this.$emit('update:pickDate', event)
      this.showPicker = false
    }
  }
}
</script>
