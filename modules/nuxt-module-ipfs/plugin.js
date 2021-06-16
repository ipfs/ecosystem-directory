/*
 *
 * 🔌 [Plugin | NuxtModuleIpfs] Methods
 *
 */

console.log(`🔌 [Module | NuxtModuleIpfs] Methods`)

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ------------------------------------------------------------------ relativity
const Relativity = (path) => {
  if (!path) { return false }
  const append = path.charAt(0) === '/' ? path.slice(1) : path
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV !== 'development') {
    if (typeof window !== 'undefined') { return path }
    return `/relativity/${append}`
  }
  return path
}

// ///////////////////////////////////////////////////////////// Export & Inject
// -----------------------------------------------------------------------------
export default ({}, inject) => {
  inject('relativity', Relativity)
}
