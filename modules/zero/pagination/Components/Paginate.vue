<template>
  <component :is="rootNode">

    <slot :paginated="paginated" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ===================================================================== Imports
const setPageFromRoute = (instance) => {
  const page = parseInt(instance.$route.query.page)
  const parsed = !isNaN(page)
  instance.setPage(parsed ? page : 1)
}

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
    increment: {
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
      page: 'pagination/page',
      totalPages: 'pagination/totalPages'
    }),
    start () {
      return (this.page - 1) * this.display
    },
    end () {
      return this.start + this.display
    },
    paginated () {
      let collection = this.collection.slice(this.start, this.end)
      if (collection.length === 0) { collection = false }
      this.setCollection(collection)
      return collection
    }
  },

  watch: {
    '$route' (route) {
      setPageFromRoute(this)
    },
    collection () {
      // this.calculateTotalPages()
      // const cloned = CloneDeep(this.$route.query)
      // if (this.page > this.totalPages) {
      //   cloned.page = this.totalPages
      // }
      // if (cloned.page === 1) {
      //   delete cloned.page
      // }
      // this.$router.push({ query: cloned })
    }
  },

  mounted () {
    setPageFromRoute(this)
    this.setDisplay(this.display)
    this.calculateTotalPages()
  },

  destroyed () {
    this.clearStore()
  },

  methods: {
    ...mapActions({
      setPage: 'pagination/setPage',
      setTotalPages: 'pagination/setTotalPages',
      setDisplay: 'pagination/setDisplay',
      setCollection: 'pagination/setCollection',
      clearStore: 'pagination/clearStore'
    }),
    calculateTotalPages () {
      const total = Math.ceil(this.collection.length / this.display)
      this.setTotalPages(total)
    }
  }
}
</script>
