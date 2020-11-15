
<template>
  <div class="row q-mb-sm">
    <q-select
      :value="course"
      label="Select Course"
      outlined
      dense
      :options="courses"
      option-value="courseID"
      option-label="courseName"
      option-disable="inactive"
      emit-value
      @input="closeDialog($event)"
      map-options
      style="min-width: 250px; max-width: 300px"
    />
  </div>
</template>

<script>
import { required } from 'src/utils/validators'

export default {
  props: ['dates', 'date'],
  data () {
    return {
      model: null
    }
  },
  methods: {
    required,
    closeDialog (event) {
      this.$emit('update:date', event)
    }
  }
}
</script>
