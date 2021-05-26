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
  padding: 3rem 0 0 0;
  color: white;
  background: linear-gradient(180deg,#041727 0,#062B3F);
}
</style>
