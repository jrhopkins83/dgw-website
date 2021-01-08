<template>
  <q-page padding>
    <p v-html="leagueInfo.helpText"></p>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {

    }
  },
  components: {

  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo'])
  }
}
</script>

<style>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>
