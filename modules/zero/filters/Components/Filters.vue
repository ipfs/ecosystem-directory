<template>
  <component :is="rootNode">

    <slot :filtered="filtered" />

  </component>
</template>

<script>
// ===================================================================== Imports
// import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Filters',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    filters: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    headings () {
      const filters = this.filters
      return filters
    },
    filtered () {
      const filters = this.filters
      return filters
    }
  },

  watch: {
    collection () {
      console.log('hola')
    }
  }
}
</script>
