<template>
  <component :is="rootNode">

    <slot :paginated="paginated" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Paginate',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    display: {
      type: Number,
      required: false,
      default: 20
    },
    collection: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      routeQuery: 'filters/routeQuery',
      totalPages: 'filters/totalPages'
    }),
    page () {
      return this.routeQuery.page ? this.routeQuery.page : 1
    },
    start () {
      return (this.page - 1) * this.display
    },
    end () {
      return this.start + this.display
    },
    paginated () {
      let collection = this.collection.slice(this.start, this.end)
      if (collection.length === 0) { collection = false }
      return collection
    }
  },

  watch: {
    collection () {
      this.calculateTotalPages()
      const total = this.totalPages
      if (this.page > total) {
        this.setRouteQuery({
          key: 'page',
          data: total
        })
      }
    }
  },

  mounted () {
    if (!this.$route.query.hasOwnProperty('results')) {
      this.setRouteQuery({
        key: 'results',
        data: this.display
      })
    }
    this.calculateTotalPages()
  },

  destroyed () {
    this.clearTotalPages()
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setTotalPages: 'filters/setTotalPages',
      clearTotalPages: 'filters/clearTotalPages'
    }),
    calculateTotalPages () {
      const total = Math.ceil(this.collection.length / this.display)
      this.setTotalPages(total)
    }
  }
}
</script>
