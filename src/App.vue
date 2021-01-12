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
    ...mapActions('auth', ['getLoggedIn', 'handleAuthStateChange'])

  },
  created () {
    this.getLoggedIn()
  },
  beforeMount () {
    this.getUserInfoLS()
    this.handleAuthStateChange()
  }
}
</script>
