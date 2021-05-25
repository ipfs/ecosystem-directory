<template>
  <div class="accordion">

    <slot :active="active" />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Accordion',

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
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
      active: this.multiple ? [] : false,
      childCount: 0
    }
  },

  created () {
    this.$on('toggle', (id) => {
      if (this.multiple) {
        // Open multiple panels
        if (this.active.includes(id)) {
          this.active = this.active.filter(_id => _id !== id)
        } else {
          this.active.push(id)
        }
      } else {
        // Open single panel
        if (this.active === id) {
          this.active = false
        } else {
          this.active = id
        }
      }
    })
  },

  mounted () {
    this.childCount = this.$children.length
  },

  methods: {
    setSelected (id) {
      if (this.multiple) {
        this.active.push(id)
      } else {
        this.active = id
      }
    }
  }
}
</script>
