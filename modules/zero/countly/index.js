/*
 *
 * 📦 [Module] Countly
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const CountlyPlugin = Path.resolve(__dirname, 'Plugins/countly.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// performStartupChecks
const performStartupChecks = (instance, next) => {
  // Check for existence of config variables
  const Config = instance.options
  if (!Config.hasOwnProperty('countly')) { throw new Error('"countly" configuration block is missing from nuxt.config.js') }
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////// registerMiddleware
const registerMiddleware = (instance, next) => {
  // The functionality of the middleware below is imported in ./Plugins/index.js
  instance.options.router.middleware.push('countly')
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  const plugins = {
    Core: { src: CountlyPlugin, fileName: 'countly/plugin-countly.js' }
  }
  Object.keys(plugins).map((key) => {
    const plugin = plugins[key]
    const dst = instance.addTemplate(plugin).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, dst),
      ssr: plugin.ssr,
      mode: plugin.mode
    })
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
function CountlyModule () {
  performStartupChecks(this, () => {
    registerMiddleware(this, () => {
      registerPlugin(this, () => {
        console.log(`📦 [Module] Countly`)
      })
    })
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default CountlyModule
