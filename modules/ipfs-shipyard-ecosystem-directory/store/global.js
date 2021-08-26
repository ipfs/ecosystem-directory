// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
const insertEntityTerm = (input, settings) => {
  if (!settings) { return input }
  const string = JSON.stringify(input)
  const mapObj = settings.nomenclature
  const replaced = string.replace(/\b(?:entityTermPlural|entityTerm)\b/gi, matched => mapObj[matched])
  return JSON.parse(replaced)
}

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  siteContent: {},
  filterButtonFloating: 'middle'
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
  settings: (state) => {
    const siteContent = state.siteContent
    if (siteContent.hasOwnProperty('settings')) {
      return siteContent.settings
    }
    return false
  },
  filterButtonFloating: state => state.filterButtonFloating
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
    const key = payload.key
    let settings = this.getters['global/siteContent'].settings
    let content = payload.content
    if (key === 'core') {
      const files = ['core_settings.json', 'core_project-schema.json', 'core_taxonomy.json', 'core_general.json']
      const len = files.length
      for (let i = 0; i < len; i++) {
        const file = files[i]
        settings = this.getters['global/siteContent'].settings
        content = require(`@/static/content/${file}`)
        content = file !== 'core_settings.json' ? insertEntityTerm(content, settings) : content
        await this.dispatch('global/setSiteContent', { key: file.split('_')[1].split('.')[0], data: content })
      }
    } else if (!content) {
      content = insertEntityTerm(require(`@/static/content/core_${key}.json`), settings)
    }
    if (content) {
      await this.dispatch('global/setSiteContent', { key, data: content })
    }
  },
  // //////////////////////////////////////////////////////////// setSiteContent
  setSiteContent ({ commit }, payload) {
    commit('SET_SITE_CONTENT', payload)
  },
  // /////////////////////////////////////////////////// setFilterButtonFloating
  setFilterButtonFloating ({ commit }, toggle) {
    commit('SET_FILTER_BUTTON_FLOATING', toggle)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.siteContent = {}
  },
  SET_SITE_CONTENT (state, payload) {
    state.siteContent[payload.key] = payload.data
  },
  SET_FILTER_BUTTON_FLOATING (state, toggle) {
    state.filterButtonFloating = toggle
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
