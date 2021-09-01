// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import CloneDeep from 'lodash/cloneDeep'

const params = {
  filters: '',
  tags: '',
  page: 1,
  results: 20,
  'sort-by': '',
  'display-type': ''
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const append2URL = (state, settings, router) => {
  if (JSON.stringify(state.routeQuery) !== JSON.stringify(router.currentRoute.query)) {
    const cloned = CloneDeep(state.routeQuery)
    if (cloned.page === 1) { delete cloned.page }
    if (cloned.results === settings.visibility.setPageSize) { delete cloned.results }
    Object.keys(cloned).forEach((key) => {
      if (!cloned[key]) { delete cloned[key] }
    })
    router.push({ query: cloned })
  }
}

const initTaxonomyLabels = (taxonomy) => {
  const obj = {}
  taxonomy.categories.forEach((item) => {
    const tags = item.tags
    for (let i = 0; i < tags.length; i++) {
      obj[tags[i].slug] = tags[i].label
    }
  })
  return obj
}

const initCategoryLookUp = (taxonomy) => {
  const obj = {}
  taxonomy.categories.forEach((item) => {
    const tagSlugs = []
    for (let i = 0; i < item.tags.length; i++) {
      tagSlugs.push(item.tags[i].slug)
    }
    obj[item.slug] = { label: item.label, tags: tagSlugs }
  })
  return obj
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  filterPanelOpen: false,
  routeQuery: params,
  totalPages: 0,
  displayOptions: false,
  taxonomyLabels: false,
  categoryLookUp: false
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  filterPanelOpen: state => state.filterPanelOpen,
  routeQuery: state => state.routeQuery,
  totalPages: state => state.totalPages,
  displayOptions: state => state.displayOptions,
  taxonomyLabels: state => state.taxonomyLabels,
  categoryLookUp: state => state.categoryLookUp
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
  },
  // ///////////////////////////////////////////////////////////// setTotalPages
  setTotalPages ({ commit }, total) {
    commit('SET_TOTAL_PAGES', total)
  },
  // /////////////////////////////////////////////////////////// clearTotalPages
  clearTotalPages ({ commit }) {
    commit('CLEAR_TOTAL_PAGES')
  },
  // ///////////////////////////////////////////////////////// setDisplayOptions
  setDisplayOptions ({ commit }, displayOptions) {
    commit('SET_DISPLAY_OPTIONS', displayOptions)
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
      if (key === 'page') {
        state.routeQuery[key] = 1
      } else if (key === 'results') {
        const settings = this.getters['global/siteContent'].settings
        state.routeQuery[key] = settings.visibility.setPageSize
      } else {
        state.routeQuery[key] = ''
      }
    })
    const router = this.$router
    state.taxonomyLabels = initTaxonomyLabels(this.getters['global/siteContent'].taxonomy)
    state.categoryLookUp = initCategoryLookUp(this.getters['global/siteContent'].taxonomy)
    append2URL(state, this.getters['global/siteContent'].settings, router)
  },
  SET_ROUTE_QUERY (state, payload) {
    if (payload.key !== 'page') { state.routeQuery.page = 1 }
    state.routeQuery[payload.key] = payload.data
    const router = this.$router
    append2URL(state, this.getters['global/siteContent'].settings, router)
  },
  CLEAR_ROUTE_QUERY_TAGS (state, slug) {
    state.routeQuery.page = 1
    state.routeQuery.tags = slug
    const router = this.$router
    append2URL(state, this.getters['global/siteContent'].settings, router)
  },
  CLEAR_ALL_TAGS (state) {
    state.routeQuery.page = 1
    state.routeQuery.tags = ''
    const router = this.$router
    append2URL(state, this.getters['global/siteContent'].settings, router)
  },
  SET_TOTAL_PAGES (state, total) {
    state.totalPages = total
  },
  CLEAR_TOTAL_PAGES (state) {
    state.totalPages = 0
  },
  SET_DISPLAY_OPTIONS (state, displayOptions) {
    state.display = displayOptions
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
