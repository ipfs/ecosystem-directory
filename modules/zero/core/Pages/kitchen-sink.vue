<template>
  <div :class="`page page-${tag} container`">

    <div class="grid">
      <div class="col">
        <div class="outline">
          <h2>Typography</h2>
          <p>Currently used fonts are <code>Montserrat</code> for headings and <code>Inter</code> for body</p>
        </div>
        <Typography />
      </div>
    </div>

    <div class="grid">
      <div class="col">
        <div class="outline">
          <h2>Global Methods</h2>
          <p>A collection of helpful functions found in <code>@/plugins/global-methods</code></p>
        </div>
        <GlobalMethods />
      </div>
    </div>

    <div class="grid">
      <div class="col">
        <div class="outline">
          <h2>Accordion</h2>
          <p>The Accordion is a semi-renderless component that consists of a few sub-components. Click on a panel below to toggle the accordion. Accordion accepts <code>multiple: Boolean </code> prop to enable concurrent panel toggling and AccordionSection accepts <code>selected: Boolean</code> prop to open a panel by default.</p>
        </div>
        <Accordion />
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Typography from '@/modules/zero/core/Components/KitchenSink/Typography'
import GlobalMethods from '@/modules/zero/core/Components/KitchenSink/GlobalMethods'
import Accordion from '@/modules/zero/core/Components/KitchenSink/Accordion'

// ====================================================================== Export
export default {
  name: 'HomePage',

  components: {
    Typography,
    GlobalMethods,
    Accordion
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

.outline {
  background: $gray800;
  color: white;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-top: 4rem;
  margin-bottom: 2rem;
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  pre, code {
    color: $gray900;
  }
}

::v-deep .nested-outline {
  background: $gray300;
  display: inline-block;
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  margin: 2rem 0;
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }
}

::v-deep pre,
::v-deep code {
  display: inline-block;
  background: $gray200;
  font-weight: 600;
  border-radius: 0.25rem;
  padding: 0.25rem 0.75rem;
}

::v-deep .content {
  &.inline {
    p {
      display: inline;
      &:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}

::v-deep ul {
  li {
    list-style: none;
  }
}
</style>
