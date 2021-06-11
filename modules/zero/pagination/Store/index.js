// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  page: 1,
  totalPages: 0,
  display: 20,
  displayOptions: false
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  page: state => state.page,
  totalPages: state => state.totalPages,
  display: state => state.display,
  displayOptions: state => state.displayOptions
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////////// setPage
  setPage ({ commit }, page) {
    commit('SET_PAGE', page)
  },
  // ///////////////////////////////////////////////////////////// setTotalPages
  setTotalPages ({ commit }, total) {
    commit('SET_TOTAL_PAGES', total)
  },
  // //////////////////////////////////////////////////////////////// setDisplay
  setDisplay ({ commit }, display) {
    commit('SET_DISPLAY', display)
  },
  // ///////////////////////////////////////////////////////// setDisplayOptions
  setDisplayOptions ({ commit }, displayOptions) {
    commit('SET_DISPLAY_OPTIONS', displayOptions)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.page = 1
    state.totalPages = 0
    state.display = 20
  },
  SET_PAGE (state, page) {
    state.page = page
  },
  SET_TOTAL_PAGES (state, total) {
    state.totalPages = total
  },
  SET_DISPLAY (state, display) {
    state.display = display
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
