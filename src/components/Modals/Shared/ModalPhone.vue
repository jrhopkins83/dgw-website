<template>
  <div class="row q-mb-sm flex">
    <q-input
      :value="phone"
      @input="$emit('update:phone', $event)"
      filled
      type="tel"
      autofocus
      v-select-all
      clearable
      clear-icon="close"
      ref="phone"
      label="Phone"
      mask="(###) ### - ####"
      fill-mask
      class="col"
    />
  </div>
</template>

<script>
import { selectAll } from 'src/directives/directive-select-all'

export default {
  props: {
    phone: String
  },
  directives: {
    selectAll
  }
}
</script>

<style scoped>
.flex {
  display: flex
}
</style>
