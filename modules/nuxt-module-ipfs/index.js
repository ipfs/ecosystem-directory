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
    staticAssetsOpts = generateOptions.staticAssets
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

    // const distPath = `${__dirname}/../../dist/_nuxt`
    // const filenames = await Fs.readdirSync(distPath).filter(filename => filename.includes('.js'))
    // const len = filenames.length
    // for (let i = 0; i < len; i++) {
    //   const filename = filenames[i]
    //   let file = await Fs.readFileSync(`${distPath}/${filename}`) + ''
    //   if (file.includes('"/_nuxt/"') && !file.includes('return "/_nuxt/"')) {
    //     file = file.replace('"/_nuxt/"', `(function () {
    //       var split = window.location.pathname.split('/').filter(x => x);
    //       console.log(split);
    //       if (split[0] === "ipfs") {
    //         var relativity = "../".repeat(split.length - 2);
    //         console.log(relativity + "_nuxt/");
    //         return relativity + "_nuxt/";
    //       } else {
    //         return "/_nuxt/";
    //       }
    //     }())`)
    //     await Fs.writeFileSync(`${distPath}/${filename}`, file)
    //   }
    // }

    const distPath = `${__dirname}/../../dist/_nuxt`
    const filenames = await Fs.readdirSync(distPath).filter(filename => filename.includes('.js'))
    const len = filenames.length
    for (let i = 0; i < len; i++) {
      const filename = filenames[i]
      let file = await Fs.readFileSync(`${distPath}/${filename}`) + ''
      if (file.includes('"/_nuxt/"') && !file.includes('return "/_nuxt/"')) {
        // file = file.replace(/[a-z]\.[a-z]\+\"\"\+\{[0-9]\:\"[a-z0-9]{7}\",[0-9]:\"[a-z0-9]{7}\",[0-9]:\"[a-z0-9]{7}\",[0-9]:\"[a-z0-9]{7}\"\}\[[a-z]\]\+\"\.js\"\}/gi, 'nauras')
        // file = file.replace('"701a434"', '""')
        // file = file.replace('"81e9e14"', '""')
        // file = file.replace('"ddb009b"', '""')
        file = `
          (function () {
            console.log(window);
            window.__NUXT__.config._app.assetsPath = "../../_nuxt"
          }());
        ` + file;
        console.log(file)
        await Fs.writeFileSync(`${distPath}/${filename}`, file)
      }
    }

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
