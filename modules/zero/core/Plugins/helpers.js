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

// ////////////////////////////////////////////////////////// CompileQueryString
const CompileQueryString = (query) => {
  let compiled = ''
  if (!query || typeof query !== 'object') { return '' }
  let len = Object.keys(query).length
  for (const param in query) {
    const value = query[param]
    if (typeof value === 'string') {
      compiled += `${param}=${value}&`
    }
  }
  if (compiled !== '') {
    compiled = `?${compiled}`
  }
  len = compiled.length
  if (compiled.charAt(len - 1) === '&') {
    compiled = compiled.slice(0, len - 1)
  }
  return compiled
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({}, inject) => {
  inject('OmitDeep', OmitDeep)
  inject('GetCookie', GetCookie)
  inject('CompileQueryString', CompileQueryString)
}
