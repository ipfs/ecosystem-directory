<template>
  <div class="master-container">

    <nuxt />

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'LayoutDefault',
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: 'https://ecosystem.ipfs.tech' + this.$route.path
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
