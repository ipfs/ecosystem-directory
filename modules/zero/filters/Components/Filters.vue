<template>
  <component :is="rootNode">

    <slot :filtered="filtered" />

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Filters',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    projects: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    filters: {
      type: [Boolean, Array],
      required: false,
      default: false
    },
    selected: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      activeTags: 'filters/activeTags'
    }),
    filtered () {
      let collection = []
      if (this.selected.length) {
        for (let i = 0; i < this.projects.length; i++) {
          const proj = this.projects[i]
          const projTags = []

          for (let j = 0; j < proj.taxonomies.length; j++) {
            const tax = proj.taxonomies[j]
            for (let k = 0; k < tax.tags.length; k++) {
              projTags.push(tax.tags[k])
            }
          }

          const success = this.selected.every((val) => { return projTags.includes(val) })

          if (success) { collection.push(this.projects[i]) }
        }
      } else {
        collection = this.projects
      }

      if (collection.length === 0) { collection = false }
      this.setCollection(collection)
      return collection
    }
  },

  methods: {
    ...mapActions({
      setActiveTags: 'filters/setActiveTags',
      setCollection: 'filters/setCollection'
    })
  }
}
</script>
