<template>
  <div :class="`page page-${tag} container`">

    <section>
      <h3>Segment Slider Chart</h3>
      <SegmentSliderChart />
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'

// ====================================================================== Export
export default {
  name: 'HomePage',

  components: {
    SegmentSliderChart
  },

  data () {
    return {
      tag: 'home'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'index')
  },

  head () {
    const title = this.seo.title
    const description = this.seo.description
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: this.seo.og_url },
        { hid: 'og:type', property: 'og:type', content: this.seo.og_type },
        { hid: 'og:image', property: 'og:image', content: this.seo.og_image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.seo.og_image }
      ]
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  margin: 1rem;
}
</style>
