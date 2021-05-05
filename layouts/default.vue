<template>
  <div class="master-container">

    <SiteHeader />

    <nuxt />

  </div>
</template>

<script>
// ===================================================================== Imports
import SiteHeader from '@/components/SiteHeader'

// ====================================================================== Export
export default {
  name: 'LayoutDefault',

  components: {
    SiteHeader
  }
}
</script>

<style lang="scss" scoped>
</style>
