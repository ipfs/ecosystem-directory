<template>
  <div v-if="icons" class="social-icons-container">

    <div ref="container" class="social-icons" v-html="icons"></div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'SocialIcons',

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    icons () {
      const siteContent = this.siteContent
      if (siteContent.general && siteContent.general.social_icons) {
        return siteContent.general.social_icons
      }
      return false
    }
  },

  mounted () {
    Array.from(this.$refs.container.children).forEach((child) => {
      child.classList.add('focus-visible')
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
::v-deep .social-icons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  @include small {
    justify-content: flex-start;
  }
  a {
    width: 2rem;
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
  svg {
    display: block;
    width: 100%;
    path {
      fill: white;
    }
  }
}
</style>
