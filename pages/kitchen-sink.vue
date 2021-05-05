<template>
  <div :class="`page page-${tag} container`">

    <h2>Typography</h2>

    <Typography />

    <h2>SegmentSliderChart</h2>

    <SegmentSliderChart />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Typography from '@/components/KitchenSink/Typography'
import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'

// ====================================================================== Export
export default {
  name: 'HomePage',

  components: {
    Typography,
    SegmentSliderChart
  },

  data () {
    return {
      tag: 'general'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', 'general')
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

h1, h2, h3, h4, h5, h6 {
  margin: 3rem 0;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
}

::v-deep pre {
  display: inline-block;
  background: $gray100;
  font-weight: 600;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}

::v-deep section {
  h1, h2, h3, h4, h5, h6 {
    margin: 1rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}

::v-deep ul {
  li {
    list-style: none;
  }
}
</style>
