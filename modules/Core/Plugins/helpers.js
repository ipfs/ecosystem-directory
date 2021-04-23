/*
 *
 * 🔌 [Plugin | Core] Helpers
 *
 */

console.log(`🔌 [Plugin | Core] Helpers`)

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Cookie from 'cookie'
import CloneDeepWith from 'lodash/cloneDeepWith'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////// OmitDeep
const OmitDeep = (collection, excludeKeys) => {
  const omit = (value) => {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key]
      })
    }
  }
  return CloneDeepWith(collection, omit)
}

// /////////////////////////////////////////////////////////////////// GetCookie
const GetCookie = (string, key) => {
  const cookies = Cookie.parse(string)
  return cookies.hasOwnProperty(key) ? cookies[key] : false
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({}, inject) => {
  inject('OmitDeep', OmitDeep)
  inject('GetCookie', GetCookie)
}
