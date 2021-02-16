<template>
  <div class="row q-my-none">
    <q-layout view="hHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <top-nav-bar>
        </top-nav-bar>
      </q-header>

      <q-footer
        class="bg-white"
        bordered
      >
        <transition
          appear
          enter-active-class="animated slideInUp"
          leave-active-class="animated slideOutDown"
        >
          <div
            v-if="showAppInstallBanner"
            class="banner-container bg-primary"
          >
            <div class="constrain">
              <q-banner
                class="bg-primary text-white"
                inline-actions
                dense
              >

                <b>Install to desktop/homescreen?</b>

                <template v-slot:action>
                  <q-btn
                    @click="installApp"
                    label="Yes"
                    class="q-px-sm"
                    dense
                    flat
                  />
                  <q-btn
                    @click="showAppInstallBanner = false"
                    label="Later"
                    class="q-px-sm"
                    dense
                    flat
                  />
                  <q-btn
                    @click="neverShowAppInstallBanner"
                    label="Never"
                    class="q-px-sm"
                    dense
                    flat
                  />
                </template>
              </q-banner>
            </div>
          </div>
        </transition>

      </q-footer>

      <q-page-container style="q-pt-none">
        <router-view />
      </q-page-container>

    </q-layout>
  </div>
</template>

<script>
let deferredPrompt

export default {
  name: 'MainLayout',

  data () {
    return {
      showAppInstallBanner: false
    }
  },
  components: {
    topNavBar: require('components/Shared/TopNavBar.vue').default
  },
  methods: {
    installApp () {
      // Hide the app provided install promotion
      this.showAppInstallBanner = false
      // Show the install prompt
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
          this.neverShowAppInstallBanner()
        } else {
          console.log('User dismissed the install prompt')
        }
      })
    },
    neverShowAppInstallBanner () {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('neverShowAppInstallBanner', true)
    }
  },
  mounted () {
    const userLoggedIn = this.$q.localStorage.getItem('loggedIn')
    const neverShowAppInstallBanner = this.$q.localStorage.getItem('neverShowAppInstallBanner')

    if (!neverShowAppInstallBanner && userLoggedIn) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt = e
        // Update UI notify the user they can install the PWA
        setTimeout(() => {
          this.showAppInstallBanner = true
        }, 3000)
      })
    }
  }
}
</script>

<style lang="scss">
  .q-layout {
    max-width: 1920;
  }
</style>
