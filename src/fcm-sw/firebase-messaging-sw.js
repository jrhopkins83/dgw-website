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
    apiKey: process.env.firebaseConfig.apiKey,
    authDomain: process.env.firebaseConfig.authDomain,
    databaseURL: process.env.firebaseConfig.databaseURL,
    projectId: process.env.firebaseConfig.projectId,
    storageBucket: process.env.firebaseConfig.storageBucket,
    messagingSenderId: process.env.firebaseConfig.messagingSenderId,
    appId: process.env.firebaseConfig.appId,
    measurementId: process.env.firebaseConfig.measurementId
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
