<template>
  <div :class="`page page-${tag} container`">

    <div ref="collapsibleSection" class="collapse" :style="`height: ${sectionHeight}px;`">
      <transition-group name="fade" tag="section">
        <section v-if="!filtersActive" key="segment">
          <div ref="segmentSlider">
            <SegmentSliderChart
              v-if="!filtersActive"
              class="grid-center" />
          </div>
        </section>

        <section v-if="!filtersActive && pageData" id="section-featured-slider" key="featured">
          <div ref="featuredSection" class="grid-center">

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

        <section v-if="!filtersActive && pageData" id="section-filter" key="heading">
          <div ref="filterHeading" class="grid-center">

            <div class="col-12">
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

    <section>

      <ProjectView
        :all-projects="projects"
        @init-filters="initFilters" />

    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

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
      sectionHeight: false,
      resize: false,
      load: false,
      segmentSlider: false,
      featuredProjects: false
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
      projects: 'projects/projects',
      filtersActive: 'filters/filtersActive'
    }),
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    },
    // Page Content
    generalPageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('general')) {
        return siteContent.general
      }
      return false
    },
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('index')) {
        return siteContent.index.page_content
      }
      return false
    }
  },

  created () {
    this.$nuxt.$on('view-all-projects', () => {
      this.initFilters()
    })
  },

  mounted () {
    const filterEnabled = (this.$route.query.filters === 'enabled')
    this.setFiltersActive(filterEnabled)

    this.resize = () => { resetSectionHeight(this) }
    window.addEventListener('resize', this.resize)
    this.load = () => { resetSectionHeight(this) }
    window.addEventListener('load', this.load)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
    if (this.load) { window.removeEventListener('load', this.load) }
  },

  methods: {
    ...mapActions({
      setFiltersActive: 'filters/setFiltersActive'
    }),
    initFilters () {
      const cloned = CloneDeep(this.$route.query)
      cloned.filters = 'enabled'
      this.$router.push({ path: '/', query: cloned })
      this.setFiltersActive(true)

      this.$refs.collapsibleSection.style.height = '0px'
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.heading,
.description {
  margin-bottom: 0.75rem;
}

.hidden {
  visibility: hidden;
}

#segment-slider-chart {
  margin-top: 3rem;
  margin-bottom: 5rem;
  @include small {
    margin-top: calc(4.1665vw / 2);
  }
}

#section-filter,
#section-featured-slider {
  margin-bottom: 1rem;
}

.project-filters {
  padding: 0;
}

// ///////////////////////////////////////////////////////////////////// Transitions

.fade {
  &-enter-active {
    transition: opacity .5s;
    transition-delay: 500ms;
  }
  &-leave-active {
    transition: opacity .5s;
  }
  &-enter-to,
  &-leave {
    opacity: 1.0;
  }
  &-enter,
  &-leave-to {
    opacity: 0.0;
  }
}

.collapse {
  overflow: hidden;
  transition: height .5s;
  transition-delay: 500ms;
}

</style>
