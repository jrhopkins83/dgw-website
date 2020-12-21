<template>
  <div>
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h3">
          <slot name="header"></slot>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <slot name="message"></slot>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          @click="$emit('confirmed')"
          color="blue-10"
          label="Confirm"
        />
        <q-btn
          v-close-popup
          color="negative"
          label="Cancel"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>
