<template>
  <div class="row q-mb-sm flex">
    <q-input
      :value="email"
      @input="$emit('update:email', $event)"
      type="email"
      v-select-all
      clearable
      clear-icon="close"
      ref="email"
      label="Email"
      lazy-rules
      :rules="validation"
      class="col 12"
    >
      <template v-slot:after>
        <q-icon name="mail" />
      </template>
    </q-input>
  </div>
</template>

<script>
import { selectAll } from 'src/directives/directive-select-all'
import { validEmail, required } from 'src/utils/validators'

export default {
  props: {
    email: String,
    validation: String
  },
  directives: {
    selectAll
  },
  methods: {
    validEmail,
    required
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
</style>
