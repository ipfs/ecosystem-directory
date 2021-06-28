/*
 *
 * 📦 [Module] Apollo
 *
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////////////////// General
import Path from 'path'

// ///////////////////////////////////////////////////////////////////// Plugins
const ApolloPlugin = Path.resolve(__dirname, 'Plugins/index.js')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////// performStartupChecks
const performStartupChecks = (instance, next) => {
  // Check for existence of config variables
  const Config = instance.options
  if (!Config.publicRuntimeConfig.hasOwnProperty('apolloURI')) { throw new Error('"apolloURI" publicRuntimeConfig entry is missing from nuxt.config.js') }
  if (next) { return next() }
}

// /////////////////////////////////////////////////////////////// extendWebpack
const extendWebpack = (instance, next) => {
  instance.extendBuild((config) => {
    config.module.rules.push(
      {
        test: /\.(graphql|gql)$/,
        use: [
          { loader: 'graphql-tag/loader' }
        ]
      }
    )
  })
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////// registerPlugin
const registerPlugin = (instance, next) => {
  const { dst } = instance.addTemplate({
    src: ApolloPlugin,
    fileName: 'apollo/plugin-apollo.js'
  })
  instance.options.plugins.push({
    src: Path.join(instance.options.buildDir, dst),
    ssr: undefined,
    mode: undefined
  })
  if (next) { return next() }
}

// ///////////////////////////////////////////////////////////////////// Liftoff
// -----------------------------------------------------------------------------
function ApolloModule () {
  performStartupChecks(this, () => {
    extendWebpack(this, () => {
      registerPlugin(this, () => {
        console.log(`📦 [Module] Apollo`)
      })
    })
  })
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ApolloModule
