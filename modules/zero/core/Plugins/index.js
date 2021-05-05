/*
 *
 * 🔌 [Plugin | Core] Core
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Store from '@/modules/zero/core/Store'

// This resolves to .nuxt/middleware.js
import NuxtMiddleware from '../middleware'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////// registerGlobalStore
const registerGlobalStore = (App, next) => {
  App.store.registerModule('core', Object.assign({
    namespaced: true
  }, Store))
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }, inject) => {
  registerGlobalStore(app, () => {
    console.log(`🔌 [Plugin | Core] Core`)
  })
}
