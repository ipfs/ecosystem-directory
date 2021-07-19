/*
 *
 * 🔌 [Plugin | Countly] Countly
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Countly from 'countly-sdk-web'

import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////// registerMiddleware
const initialize = (countlyAppKey) => {
  Countly.init({
    app_key: countlyAppKey,
    url: 'https://ecosystem.ipfs.io',
    debug: Config.countly.debug
  })
  Countly.track_pageview()
  Countly.track_links()
  console.log(Countly)
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app, store, req, router, $config: { countlyAppKey } }, inject) => {
  if (!process.browser) { return }
  if (!Config.hasOwnProperty('countly')) { throw new Error('"countly" property is missing from nuxt.config.js') }
  if (!Config.countly.hasOwnProperty('debug')) { throw new Error('"countly.debug" property is missing from nuxt.config.js') }
  if (typeof Config.countly.debug !== 'boolean') { throw new TypeError('"countly.debug" property in nuxt.config.js must be of type boolean') }
  initialize(countlyAppKey)
  console.log('🔌 [Plugin | Countly] Countly')
}
