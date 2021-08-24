/*
 *
 * 📦 [Module] IPFS Shipyard Ecosystem Directory
 *
 */

const camelize = (string) => {
  return string.replace(/-./g, word => word[1].toUpperCase())
}

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'
import Fs from 'fs-extra'

import Manifestor from './scripts/manifestor'

// /////////////////////////////////////////////////////////////////////// Pages
const pages = [
  {
    name: 'ipfs-shipyard-ecosystem-directory/index',
    path: '/',
    component: Path.resolve(__dirname, 'pages/index.vue'),
    chunkName: 'ipfs-shipyard-ecosystem-directory/index'
  },
  {
    name: 'ipfs-shipyard-ecosystem-directory/project',
    path: '/project/:id',
    component: Path.resolve(__dirname, 'pages/_project.vue'),
    chunkName: 'ipfs-shipyard-ecosystem-directory/project'
  },
  {
    name: 'ipfs-shipyard-ecosystem-directory/showcase',
    path: '/:slug',
    component: Path.resolve(__dirname, 'pages/_showcase.vue'),
    chunkName: 'ipfs-shipyard-ecosystem-directory/showcase'
  }
]

// ///////////////////////////////////////////////////////////////////// Plugins
const plugins = [
  {
    src: Path.resolve(__dirname, 'plugins/helpers.js'),
    filename: 'ipfs-shipyard-ecosystem-directory/helpers.js'
  },
  {
    src: Path.resolve(__dirname, 'plugins/taxonomy-methods.js'),
    filename: 'ipfs-shipyard-ecosystem-directory/taxonomy-methods.js'
  },
  {
    src: Path.resolve(__dirname, 'plugins/global-components.js'),
    filename: 'ipfs-shipyard-ecosystem-directory/global-components.js'
  },
  {
    src: Path.resolve(__dirname, 'plugins/register-store.js'),
    filename: 'ipfs-shipyard-ecosystem-directory/register-store.js'
  }
]

// ///////////////////////////////////////////////////////////////////// Layouts
const layouts = [
  {
    src: Path.resolve(__dirname, 'layouts/base.vue'),
    name: 'base',
    filename: 'ipfs-shipyard-ecosystem-directory/base.vue'
  },
  {
    src: Path.resolve(__dirname, 'layouts/showcase.vue'),
    name: 'showcase',
    filename: 'ipfs-shipyard-ecosystem-directory/showcase.vue'
  },
  {
    src: Path.resolve(__dirname, 'layouts/error.vue'),
    name: 'error',
    filename: 'ipfs-shipyard-ecosystem-directory/error.vue'
  }
]

// ////////////////////////////////////////////////////////////////////// Assets
const ScssUtilitiesPath = Path.resolve(__dirname, 'assets/scss/utilities.scss')
const ScssMainPath = Path.resolve(__dirname, 'assets/scss/main.scss')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////// runCheckers
const runCheckers = (instance) => {
  return new Promise((next) => {
    const appRootDir = instance.options.rootDir
    const entities = [
      { type: 'dir', path: `${appRootDir}/static/content` },
      { type: 'dir', path: `${appRootDir}/pages` },
      { type: 'dir', path: `${appRootDir}/components` },
      { type: 'dir', path: `${appRootDir}/store` },
      { type: 'file', path: `${appRootDir}/store/index.js`, data: '// At least one store file must exist in this @/store directory. If you are using a store, you can delete this file. If you are not using a store then this is a required file and should be commited to your git repo. DO NOT DELETE.' }
    ]
    entities.forEach((entity) => {
      const path = entity.path
      if (!Fs.existsSync(path)) {
        if (entity.type === 'dir') {
          Fs.mkdirSync(path)
        } else if (entity.type === 'file') {
          Fs.writeFileSync(path, entity.data)
        }
      }
    })
    next()
  })
}

// ////////////////////////////////////////////////////////////// compileContent
const compileContent = (instance) => {
  return new Promise((next) => {
    const appRootDir = instance.options.rootDir
    const contentDirCore = Path.resolve(__dirname, 'content')
    const contentDist = `${appRootDir}/static/content`
    const getFile = (path, pathname) => {
      const entities = Fs.readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.name !== '.DS_Store')
      entities.forEach((entity) => {
        const name = entity.name
        if (entity.isDirectory()) {
          getFile(Path.resolve(`${path}/${name}`), `${pathname}/${name}`)
        } else {
          const split = name.split('.')
          if (split.length === 2 && split[1] === 'json') {
            let override
            try {
              override = Fs.readFileSync(`${appRootDir}/${pathname}/${name}`)
            } catch (e) {
              override = Fs.readFileSync(`${path}/${name}`)
            }
            Fs.writeFileSync(`${contentDist}/core_${name}`, override)
          }
        }
      })
    }; getFile(contentDirCore, 'content')
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerRoutes
const registerRoutes = (instance) => {
  return new Promise((next) => {
    // Register base routes/pages
    instance.extendRoutes((routes) => {
      pages.forEach(page => routes.push(page))
    })
    // Register all project pages and import payloads
    instance.options.generate.routes = () => {
      return require(`${instance.options.rootDir}/static/content/project-routes.json`)
    }
    next()
  })
}

// ///////////////////////////////////////////////////////////// registerLayouts
const registerLayouts = (instance) => {
  return new Promise((next) => {
    layouts.forEach(layout => instance.addLayout(layout, layout.name))
    next()
  })
}

// ////////////////////////////////////////////////////////// registerComponents
const registerComponents = (instance) => {
  return new Promise((next) => {
    const componentsDir = `${instance.options.rootDir}/components`
    plugins.forEach((plugin) => {
      // Need to pass component name list to global-components.js, which subsequently
      // loads all the module components as global ones for app-wide use
      if (plugin.filename === 'ipfs-shipyard-ecosystem-directory/global-components.js') {
        plugin.options = []
        Path.resolve(__dirname, 'layouts/error.vue')
        const components = Fs.readdirSync(`${__dirname}/components`).filter(file => file !== '.DS_Store')
        components.forEach((component) => {
          const name = component.split('.')[0]
          let override
          try {
            override = Fs.readFileSync(`${componentsDir}/${component}`)
            override = `${componentsDir}/${component}`
          } catch (e) {
            override = false
          }
          const path = override || Path.resolve(__dirname, `components/${component}`)
          plugin.options.push({ name, path })
        })
      }
    })
    next()
  })
}

// //////////////////////////////////////////////////////////////// compileStore
const compileStore = (instance) => {
  return new Promise((next) => {
    const contentDir = instance.options.rootDir
    plugins.forEach((plugin) => {
      if (plugin.filename === 'ipfs-shipyard-ecosystem-directory/register-store.js') {
        plugin.options = []
        const storePath = Path.resolve(__dirname, 'store')
        const stores = Fs.readdirSync(storePath).filter(store => store !== '.DS_Store')
        stores.forEach((store) => {
          const path = Path.resolve(storePath, store)
          plugin.options.push({
            name: camelize(store.split('.')[0]),
            path,
            content: Fs.readFileSync(path) + ''
          })
        })
      }
    })
    next()
  })
}

// ///////////////////////////////////////////////////////////// registerPlugins
const registerPlugins = (instance) => {
  return new Promise((next) => {
    // Add all required plugins
    plugins.forEach((plugin) => {
      instance.addPlugin(plugin)
    })
    // Add Countly plugin if required
    const initialize = instance.options.hasOwnProperty('countly') && instance.options.countly.initialize
    if (initialize) {
      instance.addPlugin({
        src: Path.resolve(instance.options.rootDir, 'modules/zero/core/Plugins/countly.js'),
        filename: 'ipfs-shipyard-ecosystem-directory/countly.js'
      })
    }
    next()
  })
}

// ////////////////////////////////////////////////////////////// registerAssets
const registerAssets = (instance) => {
  return new Promise((next) => {
    const styleResources = instance.options.styleResources
    instance.options.css.splice(0, 0, ScssMainPath)
    styleResources.hasOwnProperty('scss') && Array.isArray(styleResources.scss) ?
      instance.options.styleResources.scss.splice(0, 0, ScssUtilitiesPath) :
      instance.options.styleResources.scss = [ScssUtilitiesPath]
    next()
  })
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
export default async function () {
  await runCheckers(this)
  await compileContent(this)
  await Manifestor(this)
  await registerRoutes(this)
  await registerLayouts(this)
  await registerComponents(this)
  await compileStore(this)
  await registerPlugins(this)
  await registerAssets(this)
  console.log(`📦 [Module] IPFS Shipyard Ecosystem Directory`)
}
