/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js')

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
  // Customize notification here
  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.message,
    icon: '/icons/icon-192x192.png'
  }

  self.registration.showNotification(notificationTitle,
    notificationOptions)
})

self.addEventListener('notificationclick', event => {
  const notification = event.notification
  const action = JSON.parse(event.notification.data)
  console.log('event', event)

  event.waitUntil(
    clients.matchAll().then(clis => {
      const clientUsingApp = clis.find(cli => {
        console.log('cli', cli)
        return cli.visibilityState === 'visible'
      })
      if (action.action === 'openUrl') {
        if (clientUsingApp) {
          clientUsingApp.navigate(action.url)
          clientUsingApp.focus()
        } else {
          clients.openWindow(action.url)
        }
      }
    })
  )
  notification.close()
})
