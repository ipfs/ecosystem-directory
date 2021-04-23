// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import GeneralSiteData from '@/content/pages/general.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {}
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  siteContent: state => state.siteContent
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
      case 'general': data = GeneralSiteData; break
      default : data = payload.data; break
    }
    if (data) {
      await this.dispatch('global/setSiteContent', { key, data })
    }
  },
  // //////////////////////////////////////////////////////////// setSiteContent
  setSiteContent ({ commit }, payload) {
    commit('SET_SITE_CONTENT', payload)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.siteContent = {}
    state.clipboard = false
    state.filterValue = ''
  },
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
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
