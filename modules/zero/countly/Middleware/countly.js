// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Countly from 'countly-sdk-web'
// const Countly = require('countly-sdk-web')
// import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------

// ////////////////////////////////////////////////////////// handleUnauthorized
// const HandleUnauthorized = async (ctx) => {
// console.log('HIT')
// }

// ///////////////////////////////////////////////////////////////////// Exports
// -----------------------------------------------------------------------------
export default async (ctx) => {
  if (process.browser) {
    console.log('================================================= COUNT THIS!')
    console.log(process.browser)
    await console.log(Countly)
  }
}
