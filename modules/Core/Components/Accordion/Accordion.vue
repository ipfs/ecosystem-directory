<template>
  <div class="accordion">

    <slot :selected="selected" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Accordion',

  props: {
    toggleOnLoad: {
      type: Boolean,
      required: false,
      default: false
    },
    toggleWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    },
    scrollToWhenAdded: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      selected: false,
      childCount: 0
    }
  },

  created () {
    this.$on('toggle', (id) => {
      if (this.selected === id) {
        this.selected = false
      } else {
        this.selected = id
      }
    })
  },

  mounted () {
    this.childCount = this.$children.length
  }
}
</script>
