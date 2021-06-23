<template>
  <div
    id="segment-slider-chart"
    ref="segmentSlider"
    @keyup.left="setSliderContent(selected - 1)"
    @keyup.right="setSliderContent(selected + 1)">

    <div class="main-container">

      <Slider
        v-if="chartItems"
        :selected-cat="chartItems[selected]"
        :selected-seg="selected"
        :parent-category="parentCategory"
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
  const industry = {}
  const tax = instance.siteContent.taxonomy.categories
  let categories
  for (let i = 0; i < tax.length; i++) {
    if (tax[i].label === 'Industry') {
      categories = tax[i].tags
    }
  }
  for (let i = 0; i < categories.length; i++) {
    industry[categories[i].slug] = categories[i].label
  }
  return industry
}

const initCategoryLogos = (instance) => {
  const logos = {}
  const tax = instance.siteContent.taxonomy.categories
  let categories
  for (let i = 0; i < tax.length; i++) {
    if (tax[i].label === 'Industry') {
      categories = tax[i].tags
    }
  }
  for (let i = 0; i < categories.length; i++) {
    logos[categories[i].slug] = []
  }
  return logos
}

const createLabels = (instance, projects) => {
  const tags = []
  const len = projects.length
  const industry = loadTaxonomies(instance)
  const logos = initCategoryLogos(instance)

  for (let i = 0; i < len; i++) {
    const industryTags = projects[i].taxonomies[0].tags
    if (Array.isArray(industryTags)) {
      for (let j = 0; j < industryTags.length; j++) {
        if (typeof projects[i].logo.icon === 'string') {
          logos[industryTags[j]].push(projects[i].logo.icon)
        }
        tags.push(industryTags[j])
      }
    }
  }

  if (tags.length) {
    const categories = [...new Set(tags)]
    const items = []
    const len = categories.length
    for (let i = 0; i < len; i++) {
      const category = categories[i]
      if (industry.hasOwnProperty(category)) {
        let count = 0
        let selection = []
        const label = industry[category]
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
        items.push({
          label,
          slug: category,
          size: count * 10,
          chars: l,
          logos: selection,
          display: true,
          description: getCategoryDescription(instance, label)
        })
      }
    }
    return items
  }
  return false
}

const getCategoryDescription = (instance, label) => {
  const industry = instance.siteContent.taxonomy.categories[0]
  const len = industry.tags.length
  for (let i = 0; i < len; i++) {
    if (industry.tags[i].label === label) {
      if (industry.tags[i].hasOwnProperty('description')) {
        return industry.tags[i].description
      }
    }
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
      segmentChart: false
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
    parentCategory () {
      return this.siteContent.taxonomy.categories[0].slug
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
