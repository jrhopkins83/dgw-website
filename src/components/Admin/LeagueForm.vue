<template>
  <div>
    <!-- <div class="q-pa-xs">
      <next-date></next-date>
    </div>
    <div class="q-pa-xs">
      <league-parms></league-parms>
    </div> -->
    <div class="q-pa-xs">
      <make-admin></make-admin>
    </div>
    <div class="q-pa-xs">
      <uploads></uploads>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    // nextDate: require('components/Admin/NextDate.vue').default,
    makeAdmin: require('components/Admin/MakeAdmin.vue').default,
    uploads: require('components/Admin/Uploads.vue').default
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>
