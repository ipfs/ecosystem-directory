/*
 *
 * 📦 [Module] NuxtModuleIpfs
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs-extra'

// ///////////////////////////////////////////////////////////////////// Plugins
const MethodsPlugin = Path.resolve(__dirname, 'plugin.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ------------------------------------------------------------- registerPlugins
const registerPlugins = (instance, next) => {
  const plugins = {
    Methods: { src: MethodsPlugin, fileName: 'nuxt-module-ipfs/methods.js' }
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

// ------------------------------------------------------------------ parseRoute
const parseRoute = (route) => {
  // console.log(route)
  const relativity = '../'.repeat(route.split('/').length - 1)
  return {
    // Make core nuxt files relative
    replaceSrc: route !== '/' ? `${relativity}_nuxt/` : '_nuxt/',
    // Make static directory files relative -- MUST run all component paths through $relativity method
    replaceStatic: route !== '/' ? relativity : ''
  }
}

// -------------------------------------------------------------------- addHooks
const addHooks = (instance) => {
  let staticAssetsOpts
  let parsed
  let initialScripts
  let asyncScripts

  /*
    Grab the static asset path options to be applied in the render:routeContext
    hook (need the dir and the bundle version)
  */

  instance.nuxt.hook('generate:before', (generator, generateOptions) => {
    // console.log(generator.options.router.base)
    // generator.options.router.base = (function () {
    //   return '/hello/'
    // }())
    // console.log(generator.options.router.base)
    staticAssetsOpts = generateOptions.staticAssets
  })

  instance.nuxt.hook('render:resourcesLoaded', (resources) => {
    resources.clientManifest.initial = resources.clientManifest.initial.concat(resources.clientManifest.async)
    initialScripts = resources.clientManifest.initial
    asyncScripts = resources.clientManifest.async
    resources.clientManifest.publicPath = (function () {
      return '_nuxt/'
    }())
    // console.log(resources.clientManifest)
    // console.log(resources.serverManifest.files['pages/index.js'] + '')
    // console.log(initialScripts)
    // console.log(asyncScripts)
  })

  /*
    This block gives us access to the generated javascript before it is
    serialized
  */

  instance.nuxt.hook('vue-renderer:ssr:context', (ctx) => {
    parsed = parseRoute(ctx.nuxt.routePath)
    // Apply url replacements to generated javascript before it is serialized
    ctx.staticAssetsBase = `${parsed.replaceSrc}${staticAssetsOpts.dir}/${staticAssetsOpts.version}`
  })

  /*
    This block gives us access to the generated HTML
  */

  instance.nuxt.hook('generate:page', async (payload) => {
    parsed = parseRoute(payload.route)
    payload.html = payload.html
      .replace(/"\/_nuxt\//gi, `"${parsed.replaceSrc}`)
      .replace(/\(\/_nuxt\//gi, `(${parsed.replaceSrc}`)
      .replace(/\/relativity\//gi, parsed.replaceStatic)
    // console.log(payload.html)

    // const script = `
    //   <script>
    //     /*(function () {
    //       if (typeof window !== 'undefined') {
    //         const ipfsPathRegExp = new RegExp('^(/(?:ipfs|ipns)/[^/]+)')
    //         const ipfsPathPrefix = (window.location.pathname.match(ipfsPathRegExp) || [])[1] || ''
    //
    //         console.log('__webpack_public_path__', __webpack_public_path__)
    //
    //         if (ipfsPathPrefix) {
    //           __webpack_public_path__ = ipfsPathPrefix + '/_nuxt/'
    //         }
    //
    //         console.log('__webpack_public_path__', __webpack_public_path__)
    //       }
    //     }())*/
    //   </script>
    // `
    //
    // // console.log(payload.html)
    //
    // const split = payload.html.split('</body>')
    // const len = split.length
    // split.splice(1, len - 2, script)
    // payload.html = split.join('')
    // // console.log(payload.html)

  })
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
function NuxtModuleIpfs () {
  console.log(`📦 [Module] NuxtModuleIpfs`)
  registerPlugins(this, () => {
    addHooks(this)
    // if (process.env.NODE_ENV !== 'development') {
    //   addHooks(this)
    // }
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default NuxtModuleIpfs
