/*
 *
 * 🔌 [Plugin | Countly] Countly
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
// This resolves to .nuxt/middleware.js
import NuxtMiddleware from '../middleware'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = (next) => {
  import(`@/modules/zero/countly/Middleware/countly.js`).then((middleware) => {
    NuxtMiddleware['countly'] = middleware.default
    if (next) { return next() }
  }).catch((err) => {
    console.log(err)
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app, store, req, router }, inject) => {
  registerMiddleware()
  console.log(`🔌 [Plugin | Countly] Countly`)
}
