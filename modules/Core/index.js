/*
 *
 * 📦 [Module] Core
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs'

// ///////////////////////////////////////////////////////////////////// Plugins
const CorePlugin = Path.resolve(__dirname, 'Plugins/index.js')
const HelpersPlugin = Path.resolve(__dirname, 'Plugins/helpers.js')
const ToasterPlugin = Path.resolve(__dirname, 'Plugins/toaster.js')
const UUIDPlugin = Path.resolve(__dirname, 'Plugins/uuid.js')
const VueLsPlugin = Path.resolve(__dirname, 'Plugins/vue-ls.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance, next) => {
  const plugins = {
    Core: { src: CorePlugin, fileName: 'core/plugin-core.js' },
    Helpers: { src: HelpersPlugin, fileName: 'core/plugin-helpers.js' },
    Toaster: { src: ToasterPlugin, fileName: 'core/plugin-toaster.js' },
    UUID: { src: UUIDPlugin, fileName: 'core/plugin-uuid.js' },
    VueLs: { src: VueLsPlugin, fileName: 'core/plugin-vue-ls.js', mode: 'client' }
  }
  Object.keys(plugins).map((key) => {
    const plugin = plugins[key]
    const dst = instance.addTemplate(plugin).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, dst),
      ssr: undefined,
      mode: plugin.mode
    })
  })
  if (next) { return next() }
}

// //////////////////////////////////////////////////////////////////// runHttps
const runHttps = (instance, next) => {
  if (process.env.NODE_ENV === 'development' && typeof instance.options.server === 'object') {
    const rootPath = instance.options.alias['@']
    instance.options.server.https = {
      key: Fs.readFileSync(Path.resolve(__dirname, '../../localhost_key.pem')),
      cert: Fs.readFileSync(Path.resolve(__dirname, '../../localhost_cert.pem'))
    }
  }
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
function CoreModule () {
  registerPlugins(this, () => {
    runHttps(this, () => {
      console.log(`📦 [Module] Core`)
    })
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default CoreModule
