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
      height: '0px',
      resize: false
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.content = this.$slots.default[0].elm
      this.resize = this.$throttle(() => {
        if (this.height !== '0px') {
          this.height = this.content.clientHeight + 'px'
        }
      }, 100)
      window.addEventListener('resize', this.resize)
      if (this.content.$on) {
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
