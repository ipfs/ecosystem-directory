<template>
  <div :class="`page page-${tag} container`">

    <div
      ref="collapsibleSection"
      :style="{ height: `${sectionHeight}px` }"
      class="collapsible-section">
      <transition-group name="fade" tag="section">

        <section
          v-if="segmentSlider"
          id="section-segment-slider"
          ref="segmentSlider"
          key="segment-slider">
          <div class="grid">
            <div class="col">

              <SegmentSliderChart @init="resetSectionHeight" />

            </div>
          </div>
        </section>

        <section
          v-if="featuredSlider"
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
              <FeaturedProjectsSlider @init="resetSectionHeight" />
            </div>

          </div>
        </section>

        <section
          v-if="featuredSlider"
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
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import SegmentSliderChart from '@/components/SegmentSliderChart/SegmentSliderChart'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import ProjectView from '@/components/ProjectView/ProjectView'

// =================================================================== Functions
const applyFiltersFromURL = (instance, string) => {
  if (string) {
    const slugs = string.split(',').filter(Boolean)
    Object.keys(instance.activeTags).forEach((category) => {
      const arr = slugs.filter(tag => instance.categoryLookUp[category].includes(tag))
      for (let i = 0; i < arr.length; i++) {
        instance.setActiveTags({ category, tag: arr[i] })
      }
    })
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
      segmentSlider: false,
      featuredSlider: false,
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
      routeQuery: 'global/routeQuery',
      activeTags: 'filters/activeTags',
      categoryLookUp: 'filters/categoryLookUp',
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

  watch: {
    '$route' (route) {
      if (route.query.filters === 'enabled') {
        this.collapseSegmentAndFeaturedSliders()
      } else {
        if (this.filterPanelOpen) { this.setFilterPanelOpen(false) }
        this.mountSegmentAndFeaturedSliders()
      }
    },
    activeTags: {
      deep: true,
      handler (obj) {
        const allTags = []
        Object.keys(obj).forEach((category) => {
          const tags = obj[category].tags
          if (tags.length) {
            for (let i = 0; i < tags.length; i++) {
              allTags.push(tags[i])
            }
          }
        })
        this.setRouteQuery({
          key: 'tags',
          data: allTags.length ? allTags.join(',') : ''
        })
      }
    },
    routeQuery: {
      deep: true,
      handler (obj) {
        if (JSON.stringify(obj) !== JSON.stringify(this.$route.query)) {
          const cloned = CloneDeep(this.routeQuery)
          if (cloned.page === 1) { delete cloned.page }
          if (!cloned.filters) { delete cloned.filters }
          Object.keys(cloned).forEach((key) => {
            if (!cloned[key]) { delete cloned[key] }
          })
          this.$router.push({ query: cloned })
        }
      }
    }
  },

  mounted () {
    this.resize = () => { this.resetSectionHeight() }
    window.addEventListener('resize', this.resize)

    const cloned = CloneDeep(this.$route.query)
    Object.keys(cloned).forEach((item) => {
      if (item === 'filters') {
        if (cloned[item] === 'enabled') {
          this.setFilterPanelOpen(true)
        } else {
          this.mountSegmentAndFeaturedSliders()
        }
      }
      if (item === 'tags') {
        applyFiltersFromURL(this, cloned[item])
      }
      this.setRouteQuery({
        key: item,
        data: cloned[item]
      })
    })
    if (!cloned.hasOwnProperty('filters')) {
      this.mountSegmentAndFeaturedSliders()
    }
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'global/setRouteQuery',
      setActiveTags: 'filters/setActiveTags',
      setFilterPanelOpen: 'filters/setFilterPanelOpen'
    }),
    mountSegmentAndFeaturedSliders () {
      if (!this.segmentSlider) { this.segmentSlider = true }
      if (!this.featuredSlider) { this.featuredSlider = true }
      if (this.filterPanelOpen) { this.setFilterPanelOpen(false) }
      this.setRouteQuery({ key: 'filters', data: '' })
      this.resetSectionHeight()
    },
    collapseSegmentAndFeaturedSliders () {
      if (this.segmentSlider && this.featuredSlider) {
        this.segmentSlider = false
        this.featuredSlider = false
        this.sectionHeight = 0
        window.scrollTo(0, 0)
      }
    },
    resetSectionHeight () {
      if (this.$refs.segmentSlider && this.$refs.featuredSection && this.$refs.filterHeading) {
        const x = this.$refs.segmentSlider.offsetHeight
        const y = this.$refs.featuredSection.offsetHeight
        const z = this.$refs.filterHeading.offsetHeight
        this.sectionHeight = Math.ceil(x + y + z)
      }
    }
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
