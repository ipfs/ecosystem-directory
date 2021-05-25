<template>
  <div :class="['accordion-section', { open }]">

    <slot />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'AccordionSection',

  props: {
    active: {
      type: [Boolean, Number, Array],
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      id: this._uid
    }
  },

  computed: {
    open () {
      if (Array.isArray(this.active)) {
        return this.active.includes(this.id)
      }
      return this.active === this.id
    }
  },

  watch: {
    open () {
      this.$children[1].toggleOpen()
    }
  },

  created () {
    if (this.selected) {
      setTimeout(() => {
        this.$parent.setSelected(this.id)
      }, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.accordion-section {
  position: relative;
  overflow: hidden;
}
</style>
