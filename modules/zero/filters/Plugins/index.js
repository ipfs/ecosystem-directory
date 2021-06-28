/*
 *
 * 🔌 [Plugin | Filters] Filters
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Vue from 'vue'
import Store from '@/modules/zero/filters/Store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////// registerGlobalStore
const registerStore = (App, next) => {
  App.store.registerModule('filters', Object.assign({
    namespaced: true
  }, Store))
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }, inject) => {
  registerStore(app, () => {
    console.log(`🔌 [Plugin | Filters] Filters`)
  })
}
