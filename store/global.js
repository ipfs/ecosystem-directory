// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import GeneralSiteData from '@/content/pages/general.json'
import IndexSiteData from '@/content/pages/index.json'
import TaxonomyData from '@/content/data/taxonomy.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  routeQuery: {},
  queryString: ''
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent,
  navigation: (state) => {
    const siteContent = state.siteContent
    if (siteContent.hasOwnProperty('general')) {
      return siteContent.general.navigation
    }
    return false
  },
  routeQuery: state => state.routeQuery,
  queryString: state => state.queryString
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////// getBaseData
  async getBaseData ({ commit }, payload) {
    const key = typeof payload === 'string' ? payload : payload.key
    let data = false
    switch (key) {
      case 'taxonomy': data = TaxonomyData; break
      case 'general': data = GeneralSiteData; break
      case 'index': data = IndexSiteData; break
      default : data = payload.data; break
    }
    if (data) {
      await this.dispatch('global/setSiteContent', { key, data })
    }
  },
  // //////////////////////////////////////////////////////////// setSiteContent
  setSiteContent ({ commit }, payload) {
    commit('SET_SITE_CONTENT', payload)
  },
  // ///////////////////////////////////////////////////////////// setRouteQuery
  setRouteQuery ({ commit }, payload) {
    commit('SET_ROUTE_QUERY', payload)
  },
  // //////////////////////////////////////////////////////////// setQueryString
  setQueryString ({ commit }, queryString) {
    commit('SET_QUERY_STRING', queryString)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.siteContent = {}
    state.clipboard = false
    state.filterValue = ''
    state.routeQuery = {}
    state.queryString = ''
  },
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
  },
  SET_ROUTE_QUERY (state, payload) {
    state.routeQuery[payload.key] = payload.data
    state.queryString = JSON.stringify(state.routeQuery)
  },
  SET_QUERY_STRING (state, queryString) {
    state.queryString = queryString
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default {
  state,
  getters,
  actions,
  mutations
}
