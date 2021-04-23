/*
 *
 * 📦 [Module] Pagination
 *
*/
// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const PaginationPlugin = Path.resolve(__dirname, 'Plugins/index.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance, next) => {
  const plugins = {
    Pagination: { src: PaginationPlugin, fileName: 'pagination/plugin-pagination.js' }
  }
  Object.keys(plugins).map((key) => {
    const plugin = plugins[key]
    const dst = instance.addTemplate(plugin).dst
    instance.options.plugins.push({
      src: Path.join(instance.options.buildDir, dst),
      ssr: undefined,
      mode: undefined
    })
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
function PaginationModule () {
  registerPlugins(this, () => {
    console.log(`📦 [Module] Pagination`)
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default PaginationModule
