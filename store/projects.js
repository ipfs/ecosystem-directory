import Projects from '@/content/projects/manifest.json'

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = () => ({
  projects: []
})

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  projects: state => state.projects
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// clearStore
  clearStore ({ commit }) {
    commit('CLEAR_STORE')
  },
  // /////////////////////////////////////////////////////////////// getProjects
  getProjects ({ commit }) {
    try {
      const compiled = []
      const len = Projects.length
      for (let i = 0; i < len; i++) {
        const id = Projects[i]
        try {
          const project = require(`@/content/projects/${id}.json`)
          compiled.push(project)
        } catch (e) {
          console.log(e)
          continue
        }
      }
      if (compiled.length > 0) {
        commit('SET_PROJECTS', compiled)
      }
    } catch (e) {
      // Silent fail
    }
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  CLEAR_STORE (state) {
    state.projects = []
  },
  SET_PROJECTS (state, payload) {
    state.projects = payload
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
