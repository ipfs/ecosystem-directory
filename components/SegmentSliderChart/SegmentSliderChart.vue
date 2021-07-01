<template>
  <div
    id="segment-slider-chart"
    ref="segmentSlider"
    @keyup.left="setSliderContent(selected - 1)"
    @keyup.right="setSliderContent(selected + 1)">

    <div class="main-container">

      <Slider
        v-if="chartItems"
        :selected-seg="selected"
        :parent-category="primaryCategory.slug"
        :container-height="containerHeight"
        @update-slider="setSliderContent" />

      <Chart
        v-if="chartItems"
        :chart-items="chartItems"
        :selected-seg="selected"
        :container-height="containerHeight"
        @update-slider="setSliderContent"
        @keyup.left="setSliderContent(selected - 1)"
        @chart-mounted="chartMounted" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Slider from '@/components/SegmentSliderChart/Slider.vue'
import Chart from '@/components/SegmentSliderChart/Chart.vue'

// =================================================================== Functions
const loadTaxonomies = (instance) => {
  const primary = {}
  const categories = instance.primaryCategory.tags
  for (let i = 0; i < categories.length; i++) {
    const key = categories[i].slug
    primary[key] = {
      label: categories[i].label,
      description: categories[i].description
    }
    if (categories[i].hasOwnProperty('position')) {
      if (categories[i].position === 'first' || categories[i].position === 'last') {
        primary[key].priority = categories[i].position
      } else {
        primary[key].priority = false
      }
    } else {
      primary[key].priority = false
    }
  }
  return primary
}

const initCategoryLogos = (instance) => {
  const logos = {}
  const categories = instance.primaryCategory.tags
  for (let i = 0; i < categories.length; i++) {
    logos[categories[i].slug] = []
  }
  return logos
}

const createLabels = (instance, projects) => {
  const tags = []
  const len = projects.length
  const primary = loadTaxonomies(instance)
  const logos = initCategoryLogos(instance)

  for (let i = 0; i < len; i++) {
    const projectTaxonomy = projects[i].taxonomies.find(category => category.slug === instance.primaryCategory.slug)
    if (projectTaxonomy.hasOwnProperty('tags')) {
      const primaryTags = projectTaxonomy.tags
      if (Array.isArray(primaryTags)) {
        for (let j = 0; j < primaryTags.length; j++) {
          if (typeof projects[i].logo.icon === 'string' && logos.hasOwnProperty(primaryTags[j])) {
            if (!logos[primaryTags[j]].includes(projects[i].logo.icon)) {
              logos[primaryTags[j]].push(projects[i].logo.icon)
            }
          }
          tags.push(primaryTags[j])
        }
      }
    }
  }

  if (tags.length) {
    const categories = [...new Set(tags)]
    const items = []
    const len = categories.length
    for (let i = 0; i < len; i++) {
      const category = categories[i]
      if (primary.hasOwnProperty(category)) {
        let count = 0
        let selection = []
        const label = primary[category].label
        const description = primary[category].description
        const l = label.split('').length
        const icons = logos[category]

        if (icons.length) {
          if (icons.length > 3) {
            for (let j = 0; j < 3; j++) {
              const index = Math.floor(Math.random() * icons.length)
              selection.push(icons[index])
              icons.splice(index, 1)
            }
          } else {
            selection = icons
          }
        }

        tags.forEach((tag) => { if (tag === category) { count++ } })
        const obj = {
          label,
          description,
          slug: category,
          size: count * 10,
          chars: l,
          logos: selection,
          display: false
        }
        if (primary[category].priority) {
          obj.priority = primary[category].priority
        }
        items.push(obj)
      }
    }
    return items
  }
  return false
}

// ====================================================================== Export
export default {

  name: 'Main',

  components: {
    Slider,
    Chart
  },

  data () {
    return {
      selected: 0,
      containerHeight: 440,
      segmentChart: false,
      primary: 'industry'
    }
  },

  async fetch ({ store, req }) {
    await store.dispatch('global/getBaseData', 'taxonomy')
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      projects: 'projects/projects'
    }),
    chartItems () {
      return createLabels(this, this.projects)
    },
    primaryCategory () {
      return this.siteContent.taxonomy.categories.find(category => category.slug === this.primary)
    }
  },

  watch: {
    segmentChart (val) {
      if (val) {
        this.$emit('init')
      }
    }
  },

  methods: {
    setSliderContent (seg) {
      if (seg < 0) { seg = this.chartItems.length - 1 }
      const mod = seg % this.chartItems.length
      this.selected = mod
    },
    chartMounted () {
      this.segmentChart = true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#segment-slider-chart {
  font-family: $fontInter;
  font-weight: 500;
  font-size: 13pt;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.main-container {
  display: flex;
  position: relative;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
}
</style>
