// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import GeneralSiteData from '@/content/pages/general.json'
import IndexSiteData from '@/content/pages/index.json'
import ProjectSiteData from '@/content/pages/project.json'
import TaxonomyData from '@/content/data/taxonomy.json'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const initRouteQueryObject = () => {
  return {
    filters: '',
    tags: '',
    page: '',
    results: '',
    'sort-by': '',
    'display-type': ''
  }
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  routeQuery: initRouteQueryObject()
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
  routeQuery: state => state.routeQuery
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////// clearRouteQuery
  clearRouteQuery ({ commit }) {
    commit('CLEAR_ROUTE_QUERY')
  },
  // /////////////////////////////////////////////////////////////// getBaseData
  async getBaseData ({ commit }, payload) {
    const key = typeof payload === 'string' ? payload : payload.key
    let data = false
    switch (key) {
      case 'taxonomy': data = TaxonomyData; break
      case 'general': data = GeneralSiteData; break
      case 'index': data = IndexSiteData; break
      case 'project': data = ProjectSiteData; break
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
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.siteContent = {}
  },
  CLEAR_ROUTE_QUERY (state) {
    state.routeQuery = initRouteQueryObject()
  },
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
  },
  SET_ROUTE_QUERY (state, payload) {
    state.routeQuery[payload.key] = payload.data
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
