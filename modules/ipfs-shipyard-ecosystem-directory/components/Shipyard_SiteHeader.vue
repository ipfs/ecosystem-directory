<template>
  <header id="site-header">

    <Shipyard_Navigation />

    <Shipyard_Hero />

  </header>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardSiteHeader'
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  padding-top: $navigationHeight;
}
</style>
