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
    selected: {
      type: [Boolean, Number],
      required: true
    }
  },

  data () {
    return {
      id: this._uid
    }
  },

  computed: {
    open () {
      return this.selected === this.id
    }
  },

  watch: {
    open () {
      this.$children[1].toggleOpen()
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
