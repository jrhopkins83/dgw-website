/* eslint-disable no-undef */
/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
/*
  dependencies
*/

import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
// import { CacheFirst } from 'workbox-strategies'
// import { ExpirationPlugin } from 'workbox-expiration'
// import { CacheableResponsePlugin } from 'workbox-cacheable-response'
// import { NetworkFirst } from 'workbox-strategies';

/*
  config
*/

precacheAndRoute(self.__WB_MANIFEST)

/*
  caching strategies
*/

registerRoute(
  ({ url }) => url.href.startsWith('http'),
  new StaleWhileRevalidate()
)

/*
  events - push
*/

self.addEventListener('push', event => {
  console.log('Push message received:', event)
  if (event.data) {
    const data = JSON.parse(event.data.text())
    event.waitUntil(
      self.registration.showNotification(
        data.title,
        {
          body: data.body,
          icon: 'icons/icon-128x128.png',
          badge: 'icons/icon-128x128.png',
          image: data.imageUrl,
          data: {
            action: data.action,
            openUrl: data.openUrl
          }
        }
      )
    )
  }
})

/*
  events - notifications
*/

self.addEventListener('notificationclick', event => {
  const notification = event.notification
  const action = notification.data.action

  if (action === 'openUrl') {
    event.waitUntil(
      clients.matchAll().then(clis => {
        const clientUsingApp = clis.find(cli => {
          return cli.visibilityState === 'visible'
        })
        if (clientUsingApp) {
          clientUsingApp.navigate(notification.data.openUrl)
          clientUsingApp.focus()
        } else {
          clients.openWindow(notification.data.openUrl)
        }
      })
    )
  }
  notification.close()
})

self.addEventListener('notificationclose', event => {
  console.log('Notification was closed', event)
})
