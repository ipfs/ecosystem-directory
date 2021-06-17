// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import TaxonomyData from '@/content/data/taxonomy.json'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const initActiveTags = () => {
  const obj = {}
  TaxonomyData.categories.forEach((item) => {
    obj[item.slug] = {
      label: item.label,
      slug: item.slug,
      tags: []
    }
  })
  return obj
}

const initTaxonomyLabels = () => {
  const obj = {}
  TaxonomyData.categories.forEach((item) => {
    const tags = item.tags
    for (let i = 0; i < tags.length; i++) {
      obj[tags[i].slug] = tags[i].label
    }
  })
  return obj
}

const initCategoryLookUp = () => {
  const obj = {}
  TaxonomyData.categories.forEach((item) => {
    const tagSlugs = []
    for (let i = 0; i < item.tags.length; i++) {
      tagSlugs.push(item.tags[i].slug)
    }
    obj[item.slug] = tagSlugs
  })
  return obj
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  activeTags: initActiveTags(),
  taxonomyLabels: initTaxonomyLabels(),
  categoryLookUp: initCategoryLookUp(),
  filterPanelOpen: false
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  activeTags: state => state.activeTags,
  taxonomyLabels: state => state.taxonomyLabels,
  categoryLookUp: state => state.categoryLookUp,
  filterPanelOpen: state => state.filterPanelOpen
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // ///////////////////////////////////////////////////////////// setActiveTags
  setActiveTags ({ commit }, payload) {
    commit('SET_ACTIVE_TAGS', payload)
  },
  // /////////////////////////////////////////////////////////// clearActiveTags
  clearActiveTags ({ commit }, category) {
    commit('CLEAR_ACTIVE_TAGS', category)
  },
  // //////////////////////////////////////////////////////// setFilterPanelOpen
  setFilterPanelOpen ({ commit }, toggle) {
    commit('SET_FILTER_PANEL_OPEN', toggle)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    Object.keys(state.activeTags).forEach((category) => {
      state.activeTags[category].tags = []
    })
  },
  SET_ACTIVE_TAGS (state, payload) {
    const category = payload.category
    const tag = payload.tag
    if (!state.activeTags[category].tags.includes(tag)) {
      state.activeTags[category].tags.push(tag)
    } else {
      const i = state.activeTags[category].tags.indexOf(tag)
      if (i > -1) {
        state.activeTags[category].tags.splice(i, 1)
      }
    }
  },
  CLEAR_ACTIVE_TAGS (state, category) {
    if (state.activeTags.hasOwnProperty(category)) {
      state.activeTags[category].tags = []
    }
  },
  SET_FILTER_PANEL_OPEN (state, toggle) {
    state.filterPanelOpen = toggle
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
