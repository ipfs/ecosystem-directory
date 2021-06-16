// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  activeTags: {},
  filterPanelOpen: false,
  selectedFiltersCount: 0
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  activeTags: state => state.activeTags,
  filterPanelOpen: state => state.filterPanelOpen,
  selectedFiltersCount: state => state.selectedFiltersCount
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // ///////////////////////////////////////////////////////////// setActiveTags
  setActiveTags ({ commit }, tags) {
    commit('SET_ACTIVE_TAGS', tags)
  },
  // //////////////////////////////////////////////////////// setFilterPanelOpen
  setFilterPanelOpen ({ commit }, toggle) {
    commit('SET_FILTER_PANEL_OPEN', toggle)
  },
  // /////////////////////////////////////////////////// setSelectedFiltersCount
  setSelectedFiltersCount ({ commit }, amount) {
    commit('SET_SELECTED_FILTERS_COUNT', amount)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.activeTags = {}
    state.filtersActive = false
    state.totalFilters = 0
  },
  SET_ACTIVE_TAGS (state, tags) {
    state.activeTags = tags
  },
  SET_FILTER_PANEL_OPEN (state, toggle) {
    state.filterPanelOpen = toggle
  },
  SET_SELECTED_FILTERS_COUNT (state, amount) {
    state.selectedFiltersCount = amount
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
