/* eslint require-await: "off" */

import Projects from './content/data/project-manifest.json'
import Settings from './content/data/settings.json'
import { SetProjectDefaults } from './plugins/global-methods'

export default {
  // //////////////////////////////////////////// Static Site Generation Options
  // ---------------------------------------------------------------------------
  target: 'static',
  generate: {
    async routes (a, b) {
      const routes = []
      routes.push({ route: Settings.general.showcaseBaseRoute })
      try {
        const len = Projects.length
        if (len === 0) { throw new Error('[nuxt.config.js] Unable to generate Project routes because no projects exist') }
        for (let i = 0; i < len; i++) {
          try {
            const slug = Projects[i]
            const route = `/project/${slug}`
            const payload = require(`./content/projects/${slug}`)
            payload.slug = slug
            SetProjectDefaults(payload)
            routes.push({ route, payload })
          } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
              const slug = e.message.split('\'')[1].split('/').pop()
              console.log(`========== Attempting to generate route /project/${slug} that does not have a corresponding project file`)
              continue
            } else {
              throw e
            }
          }
        }
        return routes
      } catch (e) {
        console.log(e)
        return routes
      }
    }
  },
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    backendUrl: (function () {
      const env = process.env.SERVER_ENV
      let uri = 'https://localhost:21000' // development
      switch (env) {
        case 'stable': uri = ''; break
        case 'production': uri = ''; break
      } return uri
    }()),
    apolloURI: (function () {
      const env = process.env.SERVER_ENV
      let uri = 'https://localhost:21000/graphql' // development
      switch (env) {
        case 'stable': uri = ''; break
        case 'production': uri = ''; break
      } return uri
    }()),
    countlyAppKey: process.env.COUNTLY_APP_KEY,
    countlySiteUrl: process.env.COUNTLY_SITE_URL,
    nodeEnv: process.env.NODE_ENV
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: (function () {
      const env = process.env.SERVER_ENV
      let port = 20000 // development
      switch (env) {
        case 'stable': port = 20001; break
        case 'production': port = 20002; break
      } return port
    }()),
    host: process.env.NODE_ENV !== 'development' ? '0.0.0.0' : 'localhost'
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  // /////////////////////////////////////////////////////// Headers of the Page
  // ---------------------------------------------------------------------------
  head: {
    title: 'IPFS Ecosystem Directory',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Proof of concepts for AU web frontend implementations in NuxtJS' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }
    ]
  },
  // ////////////////////////////////////////// Customize the progress-bar color
  // ---------------------------------------------------------------------------
  loading: {
    color: '#292929',
    height: '4px'
  },
  // /////////////////////////////////////////////////////////// Global CSS/SCSS
  // ---------------------------------------------------------------------------
  css: [
    '~/assets/theme/main.scss'
  ],
  styleResources: {
    scss: [
      '~/assets/theme/variables.scss'
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/analytics-module
    // '@nuxtjs/google-analytics', // removed dependencies for Vue Analytics due to issues
    // Doc: https://github.com/nuxt-community/moment-module#readme
    '@nuxtjs/moment'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/style-resources',
    // Collection of helper modules, plugins and functions
    '~/modules/zero/core',
    '~/modules/zero/pagination',
    '~/modules/zero/filters',
    // Doc: https://github.com/agency-undone/nuxt-module-ipfs
    '~/modules/nuxt-module-ipfs'
  ],
  // ///////////////////////////////////////////////////////// [Module] MomentJS
  // ---------------------- Doc: https://github.com/nuxt-community/moment-module
  moment: {
    timezone: true,
    defaultTimezone: 'UTC'
  },
  // ///////////////////////////////////////////////////////////// [Module] Zero
  // ---------------------------------------------------------------------------
  zero: {
    // -------------------------------------------------------- [Plugin] Toaster
    toaster: {
      display: 10,
      timeout: 5000
    }
  },
  // //////////////////////////////////////////////////////////// [Module] Axios
  // -------------------------------------- See https://axios.nuxtjs.org/options
  axios: {},
  // ////////////////////////////////////////////////////////// [Module] Countly
  // ---------------------------------------------------------------------------
  countly: {
    debug: process.env.NODE_ENV === 'development',
    disableInDevelopment: true,
    suppressErrorLogs: true
  },
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/plugins/directives',
    '~/plugins/global-methods',
    '~/plugins/taxonomy-methods',
    '~/plugins/scroll-to',
    '~/modules/zero/core/Plugins/nuxt-hammer',
    // Doc: https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript
    { src: '~/plugins/countly', mode: 'client' }
  ],
  // /////////////////////////////////////////////////////// Router + Middleware
  // ---------------------------------------------------------------------------
  router: {
    base: process.env.NODE_ENV === 'development' ? '/' : '/ipfs/hash/'
    // extendRoutes (routes, resolve) {}
  },
  // /////////////////////////////////////////////////////// Build configuration
  // ------------------------------------------------ Extend webpack config here
  build: {
    html: {
      minify: {
        collapseWhitespace: true
      }
    },
    // ---------------------------------------------------------- Hot Middleware
    hotMiddleware: {
      client: {
        overlay: false
      }
    },
    // -------------------------------------------------------------- Extensions
    extend (config, ctx) {
      config.optimization.minimize = false
      config.module.rules.push({
        test: /\.md$/,
        use: 'raw-loader'
      })
    }
  }
}
