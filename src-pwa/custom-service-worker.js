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
