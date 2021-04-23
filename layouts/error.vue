<template>
  <div class="error-page">

    <section class="content">
      <div class="grid">
        <div class="col">

          <h1 class="heading">
            {{ message }}
          </h1>

        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ErrorPage',

  serverPrefetch () {
    return this.getData()
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    message () {
      return this.siteContent.general['404_error_message']
    }
  },

  methods: {
    getData () {
      this.$store.dispatch('global/getBaseData', 'general')
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.error-page {
  position: relative;
}
</style>
