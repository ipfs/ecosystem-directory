/*
 *
 * 🔌 [Plugin | Zero + Core] GetScrollSpeed
 *
 */

window.ZERO_GETSCROLLSPEED_LAST = null
window.ZERO_GETSCROLLSPEED_TIMER
window.ZERO_GETSCROLLSPEED_DELTA = 0
window.ZERO_GETSCROLLSPEED_DELAY = 50 // higher delay -> lower fidelity
window.ZERO_GETSCROLLSPEED_CLEAR = () => {
  window.ZERO_GETSCROLLSPEED_LAST = null
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const GetScrollSpeed = (scrollPosition) => {
  const last = window.ZERO_GETSCROLLSPEED_LAST
  if (last) {
    window.ZERO_GETSCROLLSPEED_DELTA = scrollPosition - last
  }
  window.ZERO_GETSCROLLSPEED_LAST = scrollPosition
  clearTimeout(window.ZERO_GETSCROLLSPEED_TIMER)
  window.ZERO_GETSCROLLSPEED_TIMER = setTimeout(window.ZERO_GETSCROLLSPEED_CLEAR, window.ZERO_GETSCROLLSPEED_DELAY)
  return window.ZERO_GETSCROLLSPEED_DELTA
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default (ctx, inject) => {
  inject('GetScrollSpeed', GetScrollSpeed)
  console.log(`🔌 [Plugin | Zero + Core] GetScrollSpeed`)
}
