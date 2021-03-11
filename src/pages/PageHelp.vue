<template>
  <q-page padding v-if="leagueInfoLoaded">
    <p v-html="helpText"></p>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {

    }
  },
  components: {

  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo', 'leagueInfoLoaded']),
    helpText: function () {
      const userLoggedIn = this.$q.localStorage.getItem('loggedIn')
      if (userLoggedIn) {
        return this.leagueInfo.helpText
      } else {
        return this.leagueInfo.loginHelp
      }
    }
  },
  methods: {
    ...mapActions('leagueSettings', ['fbLeagueSettings'])
  },
  async beforeMount () {
    if (!this.leagueInfoLoaded) {
      await this.fbLeagueSettings()
    }
  }
}
</script>

<style>
.auth-tabs {
  max-width: 500px;
  margin: 0 auto;
}
</style>
