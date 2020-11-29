<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('leagueSettings', ['getUserInfoLS']),
    ...mapActions('players', ['getPlayersLS']),
    ...mapActions('tourneyResults', ['getFinishedPlayersLS']),
    ...mapActions('auth', ['handleAuthStateChange'])

  },
  beforeMount () {
    this.getUserInfoLS()
    this.handleAuthStateChange()
  }
}
</script>
