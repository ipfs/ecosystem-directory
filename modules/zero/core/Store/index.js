// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
import { uuid as UUID } from 'vue-uuid'
import Config from '@/nuxt.config'

const queue = ['filtered', 'sorted', 'paginated']

// /////////////////////////////////////////////////////////////////////// State
// -----------------------------------------------------------------------------
const state = {
  messages: [],
  loaders: [],
  clipboard: false,
  filterValue: '',
  filteredCollection: [],
  sortedCollection: [],
  paginatedCollection: [],
  collection: {
    mutation: '',
    array: []
  }
}

// ///////////////////////////////////////////////////////////////////// Getters
// -----------------------------------------------------------------------------
const getters = {
  messages: state => state.messages,
  loaders: state => state.loaders,
  clipboard: state => state.clipboard,
  filterValue: state => state.filterValue,
  filteredCollection: state => state.filteredCollection,
  sortedCollection: state => state.sortedCollection,
  paginatedCollection: state => state.paginatedCollection,
  collection: state => state.collection
}

// ///////////////////////////////////////////////////////////////////// Actions
// -----------------------------------------------------------------------------
const actions = {
  // //////////////////////////////////////////////////////////////// addMessage
  async addMessage ({ commit }, message) {
    const messages = this.getters['core/messages']
    const len = messages.length
    const display = Config.toaster.display
    message.id = UUID.v4()
    await commit('ADD_MESSAGE', message)
    if (len >= display) {
      this.dispatch('core/removeMessage', messages[len - display].id)
    }
  },
  // ///////////////////////////////////////////////////////////// removeMessage
  removeMessage ({ commit }, id) {
    const messages = this.getters['core/messages'].slice()
    const index = messages.findIndex(obj => obj && obj.id === id)
    if (index !== -1) {
      commit('REMOVE_MESSAGE', index)
    }
  },
  // ///////////////////////////////////////////////////////////////// addLoader
  addLoader ({ commit }, action) {
    commit('ADD_LOADER', action)
  },
  // ////////////////////////////////////////////////////////////// removeLoader
  removeLoader ({ commit }, action) {
    const loaders = this.getters['core/loaders'].slice()
    const index = loaders.findIndex(obj => obj === action)
    if (index !== -1) {
      commit('REMOVE_LOADER', index)
    }
  },
  // ////////////////////////////////////////////////////////////// setClipboard
  setClipboard ({ commit }, text) {
    this.$addTextToClipboard(text)
    commit('SET_CLIPBOARD', text)
  },
  // ////////////////////////////////////////////////////////////// setClipboard
  setFilterValue ({ commit }, value) {
    commit('SET_FILTER_VALUE', value)
  },
  // ///////////////////////////////////////////////////// setFilteredCollection
  setFilteredCollection ({ commit }, filteredCollection) {
    commit('SET_FILTERED_COLLECTION', filteredCollection)
  },
  // ///////////////////////////////////////////////////// setFilteredCollection
  setSortedCollection ({ commit }, sortedCollection) {
    commit('SET_SORTED_COLLECTION', sortedCollection)
  },
  // //////////////////////////////////////////////////// setPaginatedCollection
  setPaginatedCollection ({ commit }, paginatedCollection) {
    commit('SET_PAGINATED_COLLECTION', paginatedCollection)
  },
  // //////////////////////////////////////////////////// setPaginatedCollection
  setCollection ({ commit }, payload) {
    commit('SET_COLLECTION', payload)
  }
}

// /////////////////////////////////////////////////////////////////// Mutations
// -----------------------------------------------------------------------------
const mutations = {
  ADD_MESSAGE (state, message) {
    state.messages.push(message)
  },
  REMOVE_MESSAGE (state, index) {
    state.messages.splice(index, 1)
  },
  ADD_LOADER (state, action) {
    state.loaders.push(action)
  },
  REMOVE_LOADER (state, index) {
    state.loaders.splice(index, 1)
  },
  SET_CLIPBOARD (state, text) {
    state.clipboard = text
  },
  SET_FILTER_VALUE (state, value) {
    state.filterValue = value
  },
  SET_FILTERED_COLLECTION (state, filteredCollection) {
    state.filteredCollection = filteredCollection
  },
  SET_SORTED_COLLECTION (state, sortedCollection) {
    state.sortedCollection = sortedCollection
  },
  SET_PAGINATED_COLLECTION (state, paginatedCollection) {
    state.paginatedCollection = paginatedCollection
  },
  SET_COLLECTION (state, payload) {
    state.collection.mutation = payload.type
    state.collection.array = payload.collection
    console.log(state.collection)
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
