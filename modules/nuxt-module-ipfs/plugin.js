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
  const append = path.charAt(0) === '/' ? path.slice(1) : path
  if (process.env.NODE_ENV !== 'development') {
    if (typeof window !== 'undefined') {
      const ipfsPathRegExp = new RegExp('^(/(?:ipfs|ipns)/[^/]+)')
      const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''
      console.log(ipfsPathPrefix, path)
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

  // if (typeof window !== 'undefined') {
  //   const ipfsPathRegExp = new RegExp('^(/(?:ipfs|ipns)/[^/]+)')
  //   const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''
  //
  //   console.log('__webpack_public_path__', __webpack_public_path__)
  //
  //   if (ipfsPathPrefix) {
  //     __webpack_public_path__ = ipfsPathPrefix + '/_nuxt/'
  //     context.app.router.history.base = ipfsPathPrefix || window.location.host
  //   }
  //
  //   console.log('__webpack_public_path__', __webpack_public_path__)
  // }
}
