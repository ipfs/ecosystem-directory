<template>
  <div
    class="accordion-header"
    @click="toggle"
    @keyup.enter="toggle">

    <slot />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'AccordionHeader',

  mounted () {
    this.$nextTick(() => {
      const parent = this.$parent.$parent
      const count = parent.childCount
      const newCount = parent.$children.length
      if (parent.toggleOnLoad) {
        this.toggle()
      } else if (count !== newCount) {
        if (parent.toggleWhenAdded) { this.toggle() }
        if (parent.scrollToWhenAdded) {
          const timeout = setTimeout(() => {
            this.$scrollToElement(this.$el, 500, -96)
            clearTimeout(timeout)
          }, 150)
        }
      }
    })
  },

  methods: {
    toggle () {
      this.$parent.$parent.$emit('toggle', this.$parent._uid)
    }
  }
}
</script>
