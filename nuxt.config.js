/* eslint require-await: "off" */

export default {
  // //////////////////////////////////////////// Static Site Generation Options
  // ---------------------------------------------------------------------------
  target: 'static',
  // ///////////////////////////////////////////////////// Runtime Configuration
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------- [Runtime] Public
  publicRuntimeConfig: {
    countlyAppKey: process.env.COUNTLY_APP_KEY,
    countlySiteUrl: process.env.COUNTLY_SITE_URL,
    nodeEnv: process.env.NODE_ENV
  },
  // --------------------------------------------------------- [Runtime] Private
  privateRuntimeConfig: {},
  // /////////////////////////////////////////////////////////// Server & Render
  // ---------------------------------------------------------------------------
  server: {
    port: 20000,
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
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
    // '~/assets/core/scss/main.scss' // core
    '~/assets/scss/main.scss' // theme
  ],
  styleResources: {
    scss: [
      // '~/assets/core/scss/utilities.scss' // core
      '~/assets/scss/utilities.scss' // theme
    ]
  },
  // /////////////////////////////////////////////////////// Nuxt.js Dev Modules
  // ---------------------------------------------------------------------------
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/moment-module#readme
    '@nuxtjs/moment'
  ],
  // /////////////////////////////////////////////////////////// Nuxt.js Modules
  // ---------------------------------------------------------------------------
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '~/modules/ipfs-shipyard-ecosystem-directory',
    // Doc: https://github.com/nuxt-community/style-resources-module/
    '@nuxtjs/style-resources',
    // Collection of helper modules, plugins and functions
    '~/modules/zero/core',
    '~/modules/zero/pagination',
    '~/modules/zero/filters',
    // Doc: https://github.com/agency-undone/nuxt-module-ipfs
    'nuxt-module-ipfs'
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
  // Doc: https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript
  countly: {
    initialize: true, // if set to false, Countly will be DISABLED
    debug: process.env.NODE_ENV === 'development',
    disableInDevelopment: true,
    suppressErrorLogs: true
  },
  // /////////////////////////////////// Plugins to load before mounting the App
  // ---------------------------------------------------------------------------
  plugins: [
    '~/modules/zero/core/Plugins/click-outside',
    '~/modules/zero/core/Plugins/scroll-to',
    '~/modules/zero/core/Plugins/nuxt-hammer'
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
