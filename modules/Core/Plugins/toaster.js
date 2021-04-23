/*
 *
 * 🔌 [Plugin | Core] Toaster
 *
 */

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const Toaster = (App) => {
  return {
    addToast (toast) {
      App.store.dispatch('core/addMessage', toast)
    },
    removeToast (id) {
      App.store.dispatch('core/removeMessage', id)
    }
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app }, inject) => {
  inject('Toaster', Toaster(app))
  console.log(`🔌 [Plugin | Core] Toaster`)
}
