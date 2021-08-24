// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import Projects from '@/static/content/project-list.json'

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
    const includedProjects = []
    const len = Projects.length
    for (let i = 0; i < len; i++) {
      const project = Projects[i]
      if (project.name && project.description.short && project.logo.icon && project.taxonomies) {
        const check = []
        if (Array.isArray(project.taxonomies)) {
          for (let j = 0; j < project.taxonomies.length; j++) {
            if (typeof project.taxonomies[j] === 'object') {
              if (project.taxonomies[j].slug && project.taxonomies[j].tags) {
                if (Array.isArray(project.taxonomies[j].tags)) {
                  check.push(project.taxonomies[j].tags.every(tag => typeof tag === 'string'))
                } else {
                  check.push(false)
                }
              } else {
                check.push(false)
              }
            } else {
              check.push(false)
            }
          }
        }
        if (check.length && check.every(Boolean)) {
          includedProjects.push(this.$setProjectDefaults(project))
        }
      }
    }
    commit('SET_PROJECTS', includedProjects)
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
