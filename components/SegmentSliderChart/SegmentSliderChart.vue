<template>
  <div
    id="segment-slider-chart"
    ref="segmentSlider"
    @keyup.left="setSliderContent(selected - 1)"
    @keyup.right="setSliderContent(selected + 1)">

    <div class="main-container grid-center">

      <Slider
        :selected-cat="chartItemsArray[selected].cat"
        :selected-seg="selected"
        :container-height="containerHeight"
        excerpt="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        @update-slider="setSliderContent" />

      <Chart
        :chart-items="chartItemsArray"
        :selected-seg="selected"
        :container-height="containerHeight"
        @update-slider="setSliderContent"
        @keyup.left="setSliderContent(selected - 1)" />

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import Slider from '@/components/SegmentSliderChart/Slider.vue'
import Chart from '@/components/SegmentSliderChart/Chart.vue'

import SampleData from '@/content/sample/sampleData.json'

// ====================================================================== Export
export default {

  name: 'Main',

  components: {
    Slider,
    Chart
  },

  props: {
    allProjects: {
      type: [Boolean, Array],
      default: false,
      required: false
    }
  },

  data () {
    return {
      selected: 0,
      containerHeight: 440
    }
  },

  computed: {
    chartItemsArray () {
      const flexItems = []
      const len = SampleData.categories.length
      for (let i = 0; i < len; i++) {
        const l = SampleData.categories[i].cat.split('').length
        const frc = (0.9 * i - SampleData.categories[i].cat.split('').length) * 0.1
        const item = {
          cat: SampleData.categories[i].cat,
          size: SampleData.categories[i].count * 10,
          chars: l,
          above: Math.round(Math.random() * 1.4),
          offset: this.setOffset(l * 8, i, len),
          pos: this.setOffset(l * 8, i, len),
          force: frc
        }
        flexItems.push(item)
      }
      return flexItems
    }
  },

  methods: {
    setSliderContent (seg) {
      if (seg < 0) { seg = SampleData.categories.length - 1 }
      const mod = seg % SampleData.categories.length
      this.selected = mod
    },
    setOffset (l, i, len) {
      const lev1 = (
        (SampleData.categories[i].count / 2 +
        SampleData.categories[Math.min(i + 1, len - 1)].count / 2) * 8
      )
      const lev2 = (
        (SampleData.categories[i].count / 2 +
        SampleData.categories[Math.min(i + 1, len - 1)].count +
        SampleData.categories[Math.min(i + 2, len - 1)].count / 2) * 8
      )
      const lev3 = (
        (SampleData.categories[i].count / 2 +
        SampleData.categories[Math.min(i + 1, len - 1)].count +
        SampleData.categories[Math.min(i + 2, len - 1)].count +
        SampleData.categories[Math.min(i + 3, len - 1)].count / 2) * 8
      )
      const lev4 = (
        (SampleData.categories[i].count / 2 +
        SampleData.categories[Math.min(i + 1, len - 1)].count +
        SampleData.categories[Math.min(i + 2, len - 1)].count +
        SampleData.categories[Math.min(i + 3, len - 1)].count +
        SampleData.categories[Math.min(i + 4, len - 1)].count / 2) * 8
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
