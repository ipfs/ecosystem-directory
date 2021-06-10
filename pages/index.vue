<template>
  <div :class="`page page-${tag} container`">

    <div
      ref="collapsibleSection"
      :style="{ height: `${sectionHeight}px` }"
      class="collapsible-section">
      <transition-group name="fade" tag="section">

        <section
          v-if="!filterPanelOpen"
          id="section-featured-slider"
          ref="segmentSlider"
          key="segment-slider">
          <div class="grid">
            <div class="col">

              <SegmentSliderChart />

            </div>
          </div>
        </section>

        <section
          v-if="!filterPanelOpen"
          id="section-featured-slider"
          ref="featuredSection"
          key="featured-slider">
          <div class="grid">

            <div class="col-12">
              <h3 class="heading">
                {{ generalPageData.section_featured_slider.heading }}
              </h3>
              <div class="description">
                {{ generalPageData.section_featured_slider.description }}
              </div>
            </div>

            <div class="col-12">
              <FeaturedProjectsSlider />
            </div>

          </div>
        </section>

        <section
          v-if="!filterPanelOpen"
          id="section-filter"
          ref="filterHeading"
          key="filters-heading">
          <div class="grid">
            <div class="col">

              <h3 class="heading">
                {{ pageData.section_filter.heading }}
              </h3>

              <div class="description">
                {{ pageData.section_filter.description }}
              </div>

            </div>
          </div>
        </section>

      </transition-group>
    </div>

    <ProjectView />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import ProjectView from '@/components/ProjectView/ProjectView'

// =================================================================== Functions
const resetSectionHeight = (instance) => {
  if (instance.$refs.segmentSlider && instance.$refs.featuredSection && instance.$refs.filterHeading) {
    const x = instance.$refs.segmentSlider.offsetHeight
    const y = instance.$refs.featuredSection.offsetHeight
    const z = instance.$refs.filterHeading.offsetHeight
    instance.sectionHeight = Math.ceil(x + y + z) + 140
  }
}

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
      sectionHeight: 0,
      resize: false
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'index')
    await store.dispatch('global/getBaseData', 'taxonomy')
    await store.dispatch('projects/getProjects')
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
      siteContent: 'global/siteContent',
      filterPanelOpen: 'filters/filterPanelOpen'
    }),
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    },
    // Page Content
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent.index.page_content
    }
  },

  mounted () {
    this.resize = () => { resetSectionHeight(this) }
    window.addEventListener('resize', this.resize)
    resetSectionHeight(this)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.heading {
  margin-bottom: 0.75rem;
}

#segment-slider-chart {
  margin-top: 3rem;
  margin-bottom: 5rem;
  @include small {
    margin-top: calc(4.1665vw / 2);
  }
}

#featured-projects-slider {
  margin-top: 1rem;
}

// ///////////////////////////////////////////////////////////////// Transitions
.fade {
  &-enter-active {
    transition: opacity 500ms 500ms;
  }
  &-leave-active {
    transition: opacity 500ms;
  }
  &-enter-to,
  &-leave {
    opacity: 1;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

.collapsible-section {
  overflow: hidden;
  transition: height 500ms 500ms;
}
</style>
