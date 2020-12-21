<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      label="Game time"
      :value="pickTime"
      @input="$emit('update:pickTime', $event)"
      class="col"
    >
      <template v-slot:append>
        <q-icon
          v-if="pickTime"
          @click="$emit('update:pickTime', '')"
          name="close"
          class="cursor-pointer"
        />
        <q-icon
          name="access_time"
          class="cursor-pointer"
        >
          <q-popup-proxy v-model="showPicker">
            <q-time
              mask="h:mm A"
              :value="pickTime"
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
  props: ['pickTime'],
  data () {
    return {
      showPicker: false
    }
  },
  methods: {
    closeDialog (event) {
      this.$emit('update:pickTime', event)
      this.showPicker = false
    }
  }
}
</script>
