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
    collection: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    filtered () {
      const collection = this.collection
      return collection
    }
  },

  watch: {
    collection () {
      console.log('hola')
    }
  }
}
</script>
