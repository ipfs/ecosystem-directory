<template>
  <div :class="`page page-${tag} container`">

    <transition name="fade">
      <template v-if="showSegmentChart">

        <SegmentSliderChart />

      </template>
    </transition>

    <transition name="fade">
      <template v-if="showSegmentChart">

        <section v-if="pageData" id="section-featured-slider">
          <div class="grid-center">

            <div class="col-12">
              <h3 class="heading">
                {{ pageData.section_featured_slider.heading }}
              </h3>
              <div class="description">
                {{ pageData.section_featured_slider.description }}
              </div>
            </div>

            <div class="col-11">
              <FeaturedProjectsSlider />
            </div>

          </div>
        </section>

      </template>
    </transition>

    <section v-if="pageData" id="section-filter">
      <div class="grid-center">

        <div class="col-12">
          <h3 class="heading">
            {{ pageData.section_filter.heading }}
          </h3>
          <div class="description">
            {{ pageData.section_filter.description }}
          </div>
        </div>

      </div>

      <div>
        <ProjectView
          @hide-segment-chart="toggleProjectView" />
      </div>

    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import ProjectView from '@/components/ProjectView/ProjectView'

// ====================================================================== Export
export default {
  name: 'HomePage',

  components: {
    SegmentSliderChart,
    FeaturedProjectsSlider,
    ProjectView
  },

  data () {
    return {
      tag: 'home',
      showSegmentChart: true,
      hideFeatured: false
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
    },
    // Page Content
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('index')) {
        return siteContent.index.page_content
      }
      return false
    }
  },

  methods: {
    toggleProjectView (val) {
      this.showSegmentChart = !val
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.heading {
  margin-bottom: 1rem;
}

.hidden {
  visibility: hidden;
}

#segment-slider-chart,
#section-featured-slider,
#section-filter {
  margin-bottom: 5rem;
}

#segment-slider-chart {
  margin-top: 3rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
