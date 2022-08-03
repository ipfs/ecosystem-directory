<template>
  <div class="master-container">

    <nuxt />

  </div>
</template>

<script>
if (process.browser) {
  // https://github.com/ipfs/ecosystem-directory/pull/238
  const { href } = window.location
  if (href.includes('ecosystem.ipfs.io')) {
    window.location.replace(href.replace('ecosystem.ipfs.io', 'ecosystem.ipfs.tech'))
  }
  if (href.includes('ecosystem-ipfs-io')) {
    window.location.replace(href.replace('ecosystem-ipfs-io', 'ecosystem-ipfs-tech'))
  }
}

// ====================================================================== Export
export default {
  name: 'LayoutDefault',
  head () {
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
