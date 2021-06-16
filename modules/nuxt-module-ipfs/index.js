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
  let asyncScripts

  /*
    Grab the static asset path options to be applied in the render:routeContext
    hook (need the dir and the bundle version)
  */

  instance.nuxt.hook('generate:before', (generator, generateOptions) => {
    staticAssetsOpts = generateOptions.staticAssets
  })

  /*

  */

  instance.nuxt.hook('render:resourcesLoaded', (resources) => {
    asyncScripts = resources.clientManifest.async
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
      .replace(/\/_nuxt\//gi, parsed.replaceSrc)
      .replace(/\/relativity\//gi, parsed.replaceStatic)

    const script = `
      <script>
        var timeout = setTimeout(function () {
          var asyncScripts = ${JSON.stringify(asyncScripts)};
          var lenI = asyncScripts.length;
          var found = [];
          for (var i = 0; i < lenI; i++) {
            var filename = asyncScripts[i];
            var scripts = document.querySelectorAll('script');
            var lenJ = scripts.length;
            for (var j = 0; j < lenJ; j++) {
              var script = scripts[j];
              if (!script.src.includes(filename)) {
                console.log('NOT FOUND | ' + filename);
                var newScript = document.createElement('script');
                newScript.src = '${parsed.replaceSrc}' + filename;
                // document.body.appendChild(newScript);
                console.log(newScript);
              }
            }
          }
          clearTimeout(timeout)
        }, 500)
      </script>
    `

    const split = payload.html.split('</body>')
    const len = split.length
    split.splice(1, len - 2, script)
    payload.html = split.join('')


    // const distPath = `${__dirname}/../../dist/_nuxt`
    // const filenames = await Fs.readdirSync(distPath)
    //   .filter(filename => filename.includes('.js'))
    // // console.log(filenames)
    // const len = filenames.length
    // for (let i = 0; i < len; i++) {
    //   const filename = filenames[i]
    //   let file = await Fs.readFileSync(`${distPath}/${filename}`) + ''
    //   // console.log(file + '')
    //   if (file.includes('"/_nuxt/"')) {
    //     // console.log(`INCLUDES: ${filename}`)
    //     file = file.replace('"/_nuxt/"', '"_nuxt/"')
    //     await Fs.writeFileSync(`${distPath}/${filename}`, file)
    //   }
    // }

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
