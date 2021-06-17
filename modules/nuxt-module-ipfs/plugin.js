/* eslint-disable camelcase, no-undef */

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
  if (process.env.NODE_ENV !== 'development') {
    const append = path.charAt(0) === '/' ? path.slice(1) : path
    if (typeof window !== 'undefined') {
      const ipfsPathRegExp = new RegExp('^(/(?:ipfs|ipns)/[^/]+)')
      const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''
      console.log(ipfsPathPrefix)
      if (ipfsPathPrefix) {
        console.log(`${ipfsPathPrefix}${path}`)
        return `${ipfsPathPrefix}${path}`
      }
      return path
    }
    return `/relativity/${append}`
  }
  return path
}

// const Relativity = (path) => {
//   if (!path) { return false }
//   if (path === '/') { return '/' }
//   const append = path.charAt(0) === '/' ? path.slice(1) : path
//   if (process.env.NODE_ENV !== 'development') {
//     if (typeof window !== 'undefined') { return append }
//     return `/relativity/${append}`
//   }
//   return path
// }

// ///////////////////////////////////////////////////////////// Export & Inject
// -----------------------------------------------------------------------------
export default (context, inject) => {
  inject('relativity', Relativity)

  if (typeof window !== 'undefined') {
    const ipfsPathRegExp = new RegExp('^(/(?:ipfs|ipns)/[^/]+)')
    const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''

    if (ipfsPathPrefix) {
      console.log(`__webpack_public_path__ | ${__webpack_public_path__}`)
      console.log(`context.app.router.history.base | ${context.app.router.history.base}`)
      __webpack_public_path__ = ipfsPathPrefix + '/_nuxt/'
      context.app.router.history.base = ipfsPathPrefix + '/'
      console.log(`__webpack_public_path__ | ${__webpack_public_path__}`)
      console.log(`context.app.router.history.base | ${context.app.router.history.base}`)
    }

  }
}
