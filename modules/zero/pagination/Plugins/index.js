/*
 *
 * 🔌 [Plugin | Pagination] Pagination
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Vue from 'vue'
// import Store from '@/modules/zero/pagination/Store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////// registerGlobalStore
const registerStore = (App, next) => {
  App.store.registerModule('pagination', Object.assign({
    namespaced: true
  }))
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }, inject) => {
  registerStore(app, () => {
    console.log(`🔌 [Plugin | Pagination] Pagination`)
  })
}
