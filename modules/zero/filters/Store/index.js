// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import TaxonomyData from '@/content/data/taxonomy.json'
import CloneDeep from 'lodash/cloneDeep'

const params = {
  filters: '',
  tags: '',
  page: '',
  results: '',
  'sort-by': '',
  'display-type': ''
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const append2URL = (state, router) => {
  if (JSON.stringify(state.routeQuery) !== JSON.stringify(router.currentRoute.query)) {
    const cloned = CloneDeep(state.routeQuery)
    if (cloned.page === 1) { delete cloned.page }
    Object.keys(cloned).forEach((key) => {
      if (!cloned[key]) { delete cloned[key] }
    })
    router.push({ query: cloned })
  }
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  filterPanelOpen: false,
  routeQuery: params
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  filterPanelOpen: state => state.filterPanelOpen,
  routeQuery: state => state.routeQuery,
  taxonomyLabels: (state) => {
    const obj = {}
    TaxonomyData.categories.forEach((item) => {
      const tags = item.tags
      for (let i = 0; i < tags.length; i++) {
        obj[tags[i].slug] = tags[i].label
      }
    })
    return obj
  },
  categoryLookUp: (state) => {
    const obj = {}
    TaxonomyData.categories.forEach((item) => {
      const tagSlugs = []
      for (let i = 0; i < item.tags.length; i++) {
        tagSlugs.push(item.tags[i].slug)
      }
      obj[item.slug] = { label: item.label, tags: tagSlugs }
    })
    return obj
  }
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////// setFilterPanelOpen
  setFilterPanelOpen ({ commit }, toggle) {
    commit('SET_FILTER_PANEL_OPEN', toggle)
  },
  // /////////////////////////////////////////////////////////// clearRouteQuery
  clearRouteQuery ({ commit }) {
    commit('CLEAR_ROUTE_QUERY')
  },
  // ///////////////////////////////////////////////////////////// setRouteQuery
  setRouteQuery ({ commit, state }, payload) {
    if (payload.key === 'tags') {
      let string
      const active = state.routeQuery.tags.split(',')
      if (!active.includes(payload.data)) {
        string = state.routeQuery.tags ? state.routeQuery.tags + ',' + payload.data : payload.data
      } else {
        const i = active.indexOf(payload.data)
        if (i > -1) { active.splice(i, 1) }
        string = active.join(',')
      }
      payload.data = string
    }
    commit('SET_ROUTE_QUERY', payload)
  },
  // /////////////////////////////////////////////////////// clearRouteQueryTags
  clearRouteQueryTags ({ commit, state, getters }, category) {
    const queryTags = state.routeQuery.tags.split(',')
    const categoryTags = getters.categoryLookUp[category].tags
    const cleared = queryTags.filter(tag => !categoryTags.includes(tag)).join(',')
    commit('CLEAR_ROUTE_QUERY_TAGS', cleared)
  },
  // ////////////////////////////////////////////////////////////// clearAllTags
  clearAllTags ({ commit }) {
    commit('CLEAR_ALL_TAGS')
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  SET_FILTER_PANEL_OPEN (state, toggle) {
    state.filterPanelOpen = toggle
  },
  CLEAR_ROUTE_QUERY (state) {
    Object.keys(state.routeQuery).forEach((key) => {
      state.routeQuery[key] = ''
    })
    const router = this.$router
    append2URL(state, router)
  },
  SET_ROUTE_QUERY (state, payload) {
    state.routeQuery[payload.key] = payload.data
    const router = this.$router
    append2URL(state, router)
  },
  CLEAR_ROUTE_QUERY_TAGS (state, slug) {
    state.routeQuery.tags = slug
    const router = this.$router
    append2URL(state, router)
  },
  CLEAR_ALL_TAGS (state) {
    state.routeQuery.tags = ''
    const router = this.$router
    append2URL(state, router)
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
