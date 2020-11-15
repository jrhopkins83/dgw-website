<template>
  <q-page padding>
    <template>
      <div class='row'>
        <div class='col'>
          <league-form></league-form>
        </div>
      </div>
    </template>
    <div>
      <q-footer class="fixed-bottom">
          <q-tabs
            v-model="tab"
            shrink
            align="left"
            class="bg-primary text-white"
            :breakpoint="0"
          >
            <q-tab
              name="home"
              icon="home"
              @click="$router.push('/')"
            />
          </q-tabs>
      </q-footer>
  </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      image: 'daylight-environment.png',
      pageNavs: [
        {
          label: 'Home',
          icon: 'home',
          action: 'router.push("/")'
        }
      ],
      menu_title: 'Menu',
      tab: ''
    }
  },
  components: {
    leagueForm: require('components/Admin/LeagueForm.vue').default
  },
  computed: {
    ...mapGetters('leagueSettings', ['leagueInfo']),
    title: function () {
      return this.leagueInfo.leagueName
    },
    subtitle: function () {
      return 'Update League Info & Settings'
    }
  },
  methods: {
    home () {
      this.$router.push({ name: 'Home' })
    }
  }
}

</script>
