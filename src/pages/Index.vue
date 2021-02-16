<template>
  <q-page>
    <!-- <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    > -->
      <template v-if="leagueInfoLoaded && playersLoaded && standingsLoaded">

      <div
        v-if="showNotificationsBanner && pushNotificationsSupported"
        class="banner-container bg-primary"
      >
        <div class="constrain">
          <q-banner
            class="bg-grey-3 q-mb-md"
          >
            <template v-slot:avatar>
              <q-icon name="eva-bell-outline" color="primary" />
            </template>

            Would you like to enable notifications?

            <template v-slot:action>
              <q-btn
                @click="enableNotifications"
                label="Yes"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
              <q-btn
                @click="showNotificationsBanner = false"
                label="Later"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
              <q-btn
                @click="neverShowNotificationsBanner"
                label="Never"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
            </template>
          </q-banner>
        </div>
      </div>
        <div style="min-height: inherit;">
          <div class="row">
            <div class="col">
              <hero-section
                :bank="leagueInfo.bank"
              >
              </hero-section>
            </div>
          </div>
          <div class="row">
            <div class="col gt-md">
              <home-player-of-the-year
                :standings="standingsFiltered"
              >
              </home-player-of-the-year>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-upcoming-games></home-upcoming-games>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-leader-board
                :standings="standingsFiltered"
              >
              </home-leader-board>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <home-news></home-news>
            </div>
          </div>
        </div>
      </template>
    <!-- </transition> -->
  </q-page>
</template>

<script>
import { firebaseStore } from 'boot/firebase'
import { mapGetters } from 'vuex'
// const qs = require('qs')

export default {
  name: 'PageIndex',
  components: {
    heroSection: require('components/HomePage/HomeHeroSection.vue').default,
    homePlayerOfTheYear: require('components/HomePage/HomePlayerOfTheYear.vue').default,
    homeLeaderBoard: require('components/HomePage/HomeLeaderBoard.vue').default,
    homeUpcomingGames: require('components/HomePage/HomeUpcomingGames.vue').default,
    homeNews: require('components/HomePage/HomeNews.vue').default
  },
  data () {
    return {
      posts: [],
      loadingPosts: false,
      showNotificationsBanner: false
    }
  },
  computed: {
    ...mapGetters('standings', ['seasonStandings', 'standingsSorted', 'standingsFiltered', 'standingsLoaded']),
    ...mapGetters('leagueSettings', ['leagueInfo', 'userInfo', 'leagueInfoLoaded', 'gameDates']),
    ...mapGetters('announcements', ['announcementsLoaded', 'announcements']),
    ...mapGetters('games', ['gameDates', 'upcomingGames', 'completedGames']),
    ...mapGetters('players', ['players', 'playersLoaded']),
    serviceWorkerSupported () {
      if ('serviceWorker' in navigator) return true
      return false
    },
    pushNotificationsSupported () {
      if ('PushManager' in window) return true
      return false
    }
  },
  methods: {
    initNotificationsBanner () {
      const neverShowNotificationsBanner = this.$q.localStorage.getItem('neverShowNotificationsBanner')

      if (!neverShowNotificationsBanner) {
        this.showNotificationsBanner = true
      }
    },
    neverShowNotificationsBanner () {
      this.showNotificationsBanner = false
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    },
    // Saves the messaging device token to the datastore.
    enableNotifications () {
      // First check if browser supports push notifications and if not, hide the banner
      if (this.pushNotificationsSupported) {
        // *** Firebase Cloud Messaging ***

        // const that = this
        // const vapidKey = 'BKZG37hWd5N3pHwNuORfurhTjuhaA3gg2T4sCvYa8Wrg7HnYcsRI_85m3Dzm7KiIEXFdvS6s46lN2brSRbgx2SY'
        // messaging.getToken({ vapidKey: vapidKey }).then(function (currentToken) {
        //   if (currentToken) {
        //     // Save the Device Token to the datastore.
        //     firebaseStore.collection('fcmTokens').doc(currentToken)
        //       .set({ uid: that.userInfo.uid })
        //       .then(() => {
        //         console.log('Token successfully written!')
        //         that.neverShowNotificationsBanner()
        //         // Call method to listen for notifications
        //         that.receiveMessage()
        //       })
        //       .catch((error) => {
        //         console.error('Error writing token: ', error)
        //       })
        //   } else {
        //     // Need to request permissions to show notifications.
        //     that.requestNotificationsPermissions()
        //   }
        // }).catch(function (error) {
        //   console.error('Unable to get messaging token.', error)
        // })

        // *** Webpush notifications
        Notification.requestPermission(result => {
          console.log('result: ', result)
          this.neverShowNotificationsBanner()
          if (result === 'granted') {
            this.checkForExistingPushSubscription()
          }
        })
      } else {
        this.neverShowNotificationsBanner()
      }
    },

    // Requests permissions to show notifications.
    requestNotificationsPermissions () {
      Notification.requestPermission().then(function () {
        // Notification permission granted.
        this.neverShowNotificationsBanner()
        this.enableNotifications()
      }).catch(function (error) {
        console.error('Unable to get permission to notify.', error)
      })
    },

    // receiveMessage () {
    //   if (this.pushNotificationsSupported) {
    //     messaging.onMessage((payload) => {
    //       console.log('Message received. ', payload)
    //       console.log('payload data: ', payload.data['gcm.notification.data'])
    //       navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
    //         const options = {
    //           badge: '/icons/icon-192x192.png',
    //           body: payload.notification.body,
    //           icon: '/icons/icon-192x192.png',
    //           data: payload.data['gcm.notification.data']
    //         }
    //         registration.showNotification(
    //           payload.notification.title,
    //           options
    //         )
    //       })
    //     })
    //     // [END messaging_receive_message]
    //   }
    // },
    checkForExistingPushSubscription () {
      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        let reg
        navigator.serviceWorker.ready.then(swreg => {
          reg = swreg
          return swreg.pushManager.getSubscription()
        }).then(sub => {
          if (!sub) {
            this.createPushSubscription(reg)
          }
        })
      }
    },
    createPushSubscription (reg) {
      const vapidPublicKey = 'BD9d2d8NNm30iU4hzsKBRhpBD27wJo93TRtHbeHWYNPO9QjfSmSP579aP7hPiZZB1vTpwsQ6EsZ6Gkzh8YLlzk0'
      const vapidPublicKeyConverted = this.urlBase64ToUint8Array(vapidPublicKey)
      reg.pushManager.subscribe({
        applicationServerKey: vapidPublicKeyConverted,
        userVisibleOnly: true
      }).then(newSub => {
        const newSubData = newSub.toJSON()
        // const newSubDataQS = qs.stringify(newSubData)

        console.log('newSubData:', newSubData)
        // Save the Device Token to the datastore.
        const pushSubscription = {
          endpoint: newSubData.endpoint,
          keys: {
            auth: newSubData.keys.auth,
            p256dh: newSubData.keys.p256dh
          }
        }
        return firebaseStore.collection('notifSubscribers')
          .add({ pushSubscription: pushSubscription })
          .then(() => {
            console.log('Subscription successfully written!')
            this.neverShowNotificationsBanner()
          })
          .catch((error) => {
            console.error('Error writing Subscription: ', error)
          })
      }).catch(error => {
        console.log('Error creating subscription: ', error)
      })
    },
    urlBase64ToUint8Array (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }

  },
  created () {
    this.initNotificationsBanner()
  }

}
</script>

<style lang="scss" scoped>
  .q-page {
    min-height: auto;
  }

</style>
