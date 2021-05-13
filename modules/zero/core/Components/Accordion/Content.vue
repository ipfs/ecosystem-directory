<template>
  <div class="accordion-content" :style="{ height }">

    <slot />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'AccordionContent',

  data () {
    return {
      content: false,
      childType: false, // 'component' or 'element'
      height: '0px',
      resize: false
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.childType = this.$children.length > 0 ? 'component' : 'element'
      this.content = this.childType === 'component' ? this.$children[0].$el : this.$slots.default[0].elm
      this.resize = this.$throttle(() => {
        if (this.height !== '0px') {
          this.height = this.content.clientHeight + 'px'
        }
      }, 100)
      window.addEventListener('resize', this.resize)
      // Resize the content IF the content is a component and the content has changed and emits the changed event
      if (this.childType === 'component') {
        this.content.$on('changed', () => {
          this.$nextTick(() => {
            const height = this.content.clientHeight + 'px'
            if (height !== this.height) {
              this.height = height
            }
          })
        })
      }
    })
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    toggleOpen () {
      const height = this.height
      if (height === '0px') {
        this.height = this.content.clientHeight + 'px'
      } else {
        this.height = '0px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.accordion-content {
  transition: height 150ms ease-in-out;
}
</style>
