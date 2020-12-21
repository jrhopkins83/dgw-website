<template>
  <q-card-section class="row q-pa-none">
    <div class="text-h3">
      <slot></slot>
    </div>
    <q-space />
    <q-btn
      v-close-popup
      flat
      round
      dense
      icon="close"
      @click="$emit('close')"
    />
  </q-card-section>
</template>

<script>
export default {

}
</script>
