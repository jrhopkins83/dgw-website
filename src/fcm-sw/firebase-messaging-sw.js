/* eslint-disable no-undef */

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js')

const pushNotificationsSupported = 'pushManager' in self.registration
console.log('pushNotificationsSupported: ', pushNotificationsSupported)

if (pushNotificationsSupported) {
  // fill in the empty quotes with your credentials
  // eslint-disable-next-line no-undef
  firebase.initializeApp({
    apiKey: 'AIzaSyCCS8VSb-xeZl8dBwVxYooL3eghW6Xb9lw',
    authDomain: 'fir-authdemo-5cd82.firebaseapp.com',
    databaseURL: 'https://fir-authdemo-5cd82.firebaseio.com',
    projectId: 'fir-authdemo-5cd82',
    storageBucket: 'fir-authdemo-5cd82.appspot.com',
    messagingSenderId: '53210843527',
    appId: '1:53210843527:web:443fcc1f74d4c2d36e6b22'
  })

  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)
    const notificationTitle = payload.data.title
    const notificationOptions = {
      body: payload.data.message,
      icon: '/icons/icon-192x192.png'
    }

    console.log('onBackgroundMessage before showNotification, payload: ', JSON.stringify(payload))
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(notificationTitle,
        notificationOptions)
    })
  })

  self.onnotificationclick = event => {
    const action = JSON.parse(event.notification.data)
    console.log('event', event)
    event.notification.close()

    if (action) {
      if (action.action === 'openUrl') {
        const urlToOpen = action.url
        console.log('url: ', urlToOpen)

        event.waitUntil(
          clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          }).then((windowClients) => {
            if (windowClients.length) {
              for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i]
                if (client.visibilityState === 'visible') {
                  return windowClient.focus()
                }
              }

              if (windowClients.openWindow) {
                return windowClients.openWindow(urlToOpen)
              }
            } else {
              const fullUrl = new URL(urlToOpen, self.location.origin).href
              clients.openWindow(fullUrl)
            }
            /* Danny PWA approach */
            // const clientUsingApp = windowClients.find(client => {
            //   console.log('client; ', JSON.stringify(client))
            //   return client.visibilityState === 'visible'
            // })

            // console.log('clientUsingApp: ', clientUsingApp)
            // if (clientUsingApp) {
            //   clientUsingApp.navigate(urlToOpen).then(function (windowClient) {
            //     windowClient.focus()
            //   })
            // } else {
            //   const fullUrl = new URL(urlToOpen, self.location.origin).href
            //   clients.openWindow(fullUrl)
            // }
          })

        )
      }
    }
  }
}
