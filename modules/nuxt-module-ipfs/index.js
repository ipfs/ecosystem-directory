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

  /*
    Grab the static asset path options to be applied in the render:routeContext
    hook (need the dir and the bundle version)
  */

  instance.nuxt.hook('generate:before', (generator, generateOptions) => {
    // console.log('============================ generator.nuxt.server.publicPath')
    // // console.log(generator.nuxt.server.publicPath)
    // generator.nuxt.server.publicPath = './'
    // console.log('========================== generator.nuxt.renderer.publicPath')
    // // console.log(generator.nuxt.renderer.publicPath)
    // generator.nuxt.renderer.publicPath = './'
    // console.log('===================== generator.options.generate.staticAssets')
    // // console.log(generator.options.generate.staticAssets)
    // generator.options.generate.staticAssets.base = generator.options.generate.staticAssets.base.slice(1)
    // generator.options.generate.staticAssets.versionBase = generator.options.generate.staticAssets.versionBase.slice(1)
    // console.log('==================================== generator.options.router')
    // // console.log(generator.options.router)
    // generator.options.router.base = './'
    // console.log('===================================== generator.options.build')
    // // console.log(generator.options.build)
    // generator.options.build.publicPath = './'
    // generator.options.build._publicPath = './'
    // console.log('======================================= generator.options.app')
    // // console.log(generator.options.app)
    // generator.options.app.basePath = './'
    // generator.options.app.assetsPath = './_nuxt'

    // console.log(generateOptions)
    staticAssetsOpts = generateOptions.staticAssets
  })

  /*
    This block gives us access to the generated javascript before it is
    serialized
  */

  instance.nuxt.hook('vue-renderer:ssr:context', (ctx) => {
    // console.log('B')
    let path = ctx.nuxt.routePath
    if (path.includes('/relativity')) {
      path = path.replace('/relativity', '')
      ctx.nuxt.routePath = path
    }
    parsed = parseRoute(path)
    // // console.log(path)
    // ctx.nuxt.config._app.basePath = parsed.replaceStatic
    // ctx.nuxt.config._app.assetsPath = parsed.replaceSrc
    // // Apply url replacements to generated javascript before it is serialized
    ctx.staticAssetsBase = `${parsed.replaceSrc}${staticAssetsOpts.dir}/${staticAssetsOpts.version}`
    // console.log(parsed)
    // console.log(ctx.staticAssetsBase)
    // console.log(ctx.nuxt.config)
  })

  /*
    This block gives us access to the generated HTML
  */

  instance.nuxt.hook('generate:page', async (payload) => {
    // console.log('C')
    // console.log(payload.route)
    // console.log(payload)
    parsed = parseRoute(payload.route)
    payload.html = payload.html.replace(/\/_nuxt\//gi, parsed.replaceSrc).replace(/\/relativity\//gi, parsed.replaceStatic)
    const distPath = `${__dirname}/../../dist/_nuxt`
    const filenames = await Fs.readdirSync(distPath)
      .filter(filename => filename.includes('.js'))
    console.log(filenames)
    const len = filenames.length
    for (let i = 0; i < len; i++) {
      const filename = filenames[i]
      let file = await Fs.readFileSync(`${distPath}/${filename}`) + ''
      // console.log(file + '')
      if (file.includes('"/_nuxt/"')) {
        console.log(`INCLUDES: ${filename}`)
        file = file.replace('"/_nuxt/"', '"_nuxt/"')
        await Fs.writeFileSync(`${distPath}/${filename}`, file)
      }
    }
    // console.log(payload.html.includes('relativity'))
    // if (payload.route.includes('brave')) {
    // }
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
