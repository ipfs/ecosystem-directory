<template>
  <header id="site-header">

    <Navigation />

    <Hero />

  </header>
</template>

<script>
// ===================================================================== Imports
import Navigation from '@/components/Header/Navigation'
import Hero from '@/components/Header/Hero'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Navigation,
    Hero
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  color: white;
  background-color: #041727;
}
</style>
