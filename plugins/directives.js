// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Vue from 'vue'

// ////////////////////////////////// Click anywhere outside a modal to close it
// ---------------------------------------- https://stackoverflow.com/a/42389266
Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    el.clickOutsideEvent = function (e) {
      if (!(el === e.target || el.contains(e.target))) {
        vnode.context[binding.expression](e)
      }
    }
    el.pressEscKey = function (e) {
      if (event.defaultPrevented) { return }
      const key = event.key || event.keyCode
      if (key === 'Escape' || key === 'Esc' || key === 27) {
        vnode.context[binding.expression](e)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
    document.addEventListener('keyup', el.pressEscKey)
  },
  unbind (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
    document.removeEventListener('keyup', el.pressEscKey)
  }
})
