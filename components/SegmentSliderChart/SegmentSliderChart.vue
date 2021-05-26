<template>
  <div
    id="segment-slider-chart"
    ref="segmentSlider"
    @keyup.left="setSliderContent(selected - 1)"
    @keyup.right="setSliderContent(selected + 1)">

    <div class="main-container grid-center">

      <Slider
        v-if="chartItems"
        :selected-cat="chartItems[selected]"
        :selected-seg="selected"
        :container-height="containerHeight"
        excerpt="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        @update-slider="setSliderContent" />

      <Chart
        v-if="chartItems"
        :chart-items="chartItems"
        :selected-seg="selected"
        :container-height="containerHeight"
        @update-slider="setSliderContent"
        @keyup.left="setSliderContent(selected - 1)" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Slider from '@/components/SegmentSliderChart/Slider.vue'
import Chart from '@/components/SegmentSliderChart/Chart.vue'

import Taxonomy from '@/content/data/taxonomy.json'

// =================================================================== Functions
const createLabels = (projects) => {
  const tags = []

  for (let i = 0; i < projects.length; i++) {
    const industryTags = projects[i].taxonomies[0].tags
    for (let j = 0; j < industryTags.length; j++) {
      tags.push(industryTags[j].text)
    }
  }

  const categories = [...new Set(tags)]
  const items = []

  for (let i = 0; i < categories.length; i++) {
    const l = categories[i].split('').length
    const frc = (0.9 * i - l) * 0.1
    let count = 0
    tags.forEach((tag) => { if (tag === categories[i]) { count++ } })
    items.push({
      cat: categories[i],
      count: count,
      size: count * 10,
      chars: l,
      above: Math.round(Math.random() * 1.4),
      force: frc
    })
  }

  return addInitialOffsets(items)
}

const addInitialOffsets = (categories) => {
  for (let i = 0; i < categories.length; i++) {
    const offset = calculateOffset(categories, categories[i].chars, i)
    categories[i].offset = offset
    categories[i].pos = offset
  }
  return categories
}

const calculateOffset = (cats, l, i) => {
  const len = cats.length
  const lev1 = (
    (cats[i].size / 2 +
    cats[Math.min(i + 1, len - 1)].size / 2) * 8
  )
  const lev2 = (
    (cats[i].size / 2 +
    cats[Math.min(i + 1, len - 1)].size +
    cats[Math.min(i + 2, len - 1)].size / 2) * 8
  )
  const lev3 = (
    (cats[i].size / 2 +
    cats[Math.min(i + 1, len - 1)].size +
    cats[Math.min(i + 2, len - 1)].size +
    cats[Math.min(i + 3, len - 1)].size / 2) * 8
  )
  const lev4 = (
    (cats[i].size / 2 +
    cats[Math.min(i + 1, len - 1)].size +
    cats[Math.min(i + 2, len - 1)].size +
    cats[Math.min(i + 3, len - 1)].size +
    cats[Math.min(i + 4, len - 1)].size / 2) * 8
  )
  if (l < lev1 || i === len - 1) {
    return -50
  } else {
    if (l < lev2) {
      return -75
    } else {
      if (l < lev3) {
        return -100
      } else {
        if (l < lev4) {
          return -125
        } else {
          return -150
        }
      }
    }
  }
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
      containerHeight: 440
    }
  },

  computed: {
    ...mapGetters({
      projects: 'projects/projects'
    }),
    chartItems () {
      const data = createLabels(this.projects)
      return data
    }
  },

  mounted () {
    this.$emit('init')
  },

  methods: {
    setSliderContent (seg) {
      if (seg < 0) { seg = this.chartItems.length - 1 }
      const mod = seg % this.chartItems.length
      this.selected = mod
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#segment-slider-chart {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-container {
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
  margin: 0 auto;
}
</style>
