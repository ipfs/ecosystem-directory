// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  activeTags: false,
  collection: [],
  filtersActive: false,
  totalFilters: 0
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  activeTags: state => state.activeTags,
  collection: state => state.collection,
  filtersActive: state => state.filtersActive,
  totalFilters: state => state.totalFilters
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setActiveTags ({ commit }, tags) {
    commit('SET_ACTIVE_TAGS', tags)
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setCollection ({ commit }, collection) {
    commit('SET_COLLECTION', collection)
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setFiltersActive ({ commit }, active) {
    commit('SET_FILTERS_ACTIVE', active)
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setTotalFilters ({ commit }, amount) {
    commit('SET_TOTAL_FILTERS', amount)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.activeTags = false
    state.collection = []
    state.filtersActive = false
    state.totalFilters = 0
  },
  SET_ACTIVE_TAGS (state, tags) {
    state.activeTags = tags
  },
  SET_COLLECTION (state, collection) {
    state.collection = collection
  },
  SET_FILTERS_ACTIVE (state, active) {
    state.filtersActive = active
  },
  SET_TOTAL_FILTERS (state, amount) {
    state.totalFilters = amount
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
