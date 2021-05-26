<template>
  <div :class="`page page-${tag} container`">

    <div ref="collapsibleSection" class="collapse" :style="`height: ${sectionHeight}px;`">
      <transition-group name="fade" tag="section">
        <section v-if="!(this.$route.query.filters === 'enabled')" key="segment">
          <div ref="segmentSlider">
            <SegmentSliderChart
              v-if="!(this.$route.query.filters === 'enabled')"
              :all-projects="projects"
              class="grid-center"
              @init="segment" />
          </div>
        </section>

        <section v-if="!(this.$route.query.filters === 'enabled') && pageData" id="section-featured-slider" key="featured">
          <div ref="featuredSection" class="grid-center">

            <div class="col-12">
              <h3 class="heading">
                {{ pageData.section_featured_slider.heading }}
              </h3>
              <div class="description">
                {{ pageData.section_featured_slider.description }}
              </div>
            </div>

            <div class="col-12">
              <FeaturedProjectsSlider
                :all-projects="projects"
                @init="featured" />
            </div>

          </div>
        </section>

        <section v-if="!(this.$route.query.filters === 'enabled') && pageData" id="section-filter" key="heading">
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
        @hide-segment-chart="toggleProjectView" />

    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import ProjectView from '@/components/ProjectView/ProjectView'

// ====================================================================== Functions
const resetSectionHeight = (instance) => {
  if (!(instance.$route.query.filters === 'enabled') && instance.segmentSlider && instance.featuredProjects) {
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
      segmentSlider: false,
      featuredProjects: false
    }
  },

  async fetch ({ store, req }) {
    // const projectObjects = []
    const sample = require('@/content/sample/sampleTaxonomies.json')
    const projectObjects = sample.projects

    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'index')
    await store.dispatch('projects/getAllProjects', projectObjects)
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
      projects: 'projects/projects'
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

  mounted () {
    this.resize = () => { resetSectionHeight(this) }
    window.addEventListener('resize', this.resize)

    resetSectionHeight(this)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    toggleProjectView (val) {
      if (val) {
        this.$refs.collapsibleSection.style.height = '0px'
        window.scrollTo(0, 0)
      } else {
        this.$refs.collapsibleSection.style.height = this.sectionHeight + 'px'
      }
      this.$nuxt.$emit('changeHeader', val)
    },
    segment () {
      this.segmentSlider = true
    },
    featured () {
      this.featuredProjects = true
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
  margin-bottom: 5rem;
}

#section-filter,
#section-featured-slider {
  margin-bottom: 1rem;
}

#segment-slider-chart {
  margin-top: 3rem;
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
