/*
 *
 * 🔌 [Plugin | Apollo] Apollo
 *
 */

// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Axios from 'axios'
import { buildAxiosFetch } from '@lifeomic/axios-fetch'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { RequestInterceptor, SuccessInterceptor, ErrorInterceptor } from '@/modules/Apollo/Helpers'

import CloneDeepWith from 'lodash/cloneDeepWith'

import Config from '@/nuxt.config'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const OmitDeep = (collection, excludeKeys) => {
  const omit = (value) => {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key]
      })
    }
  }
  return CloneDeepWith(collection, omit)
}

// ////////////////////////////////////////////////////// createNewAxiosInstance
const createNewAxiosInstance = (App, redirect, next) => {
  const AxiosTransport = Axios.create({
    withCredentials: true
  })
  AxiosTransport.interceptors.request.use(RequestInterceptor(App))
  AxiosTransport.interceptors.response.use(SuccessInterceptor(App, redirect))
  if (next) { return next(AxiosTransport) }
}

// ////////////////////////////////////////////// Strip __typename from requests
const cleanTypenameLink = store => new ApolloLink((operation, forward) => {
  const keysToOmit = ['__typename']
  const def = getMainDefinition(operation.query)
  if (def && def.operation === 'mutation') {
    operation.variables = OmitDeep(operation.variables, keysToOmit)
  }
  return forward ? forward(operation) : null
})

// ////////////////////////////////////////////////////// initializeApolloClient
const initializeApolloClient = (AxiosTransport, App, store, uri, redirect, req, inject, next) => {
  const httpLink = new HttpLink({
    uri,
    fetch: buildAxiosFetch(AxiosTransport),
    credentials: 'include',
    headers: {
      ...(req.headers && req.headers.cookie) && { cookie: req.headers.cookie }
    }
  })
  const client = new ApolloClient({
    link: ApolloLink.from([
      ErrorInterceptor(App, redirect),
      cleanTypenameLink(store),
      httpLink
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  })
  inject('Apollo', client)
  if (next) { return next() }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default ({ app, store, req, redirect, $config }, inject) => {
  createNewAxiosInstance(app, redirect, (AxiosTransport) => {
    initializeApolloClient(AxiosTransport, app, store, $config.apolloURI, redirect, req ? req : {}, inject, () => {
      console.log(`🔌 [Plugin | Apollo] Apollo`)
    })
  })
}
