<template>
  <div id="segment-slider-chart" ref="chartFlex" class="chart-container">
    <div ref="segmentsCtn" class="segments-container">

      <div class="chart-title">
        <h3>{{ mobileChartTitle }}</h3>
      </div>

      <template v-if="!measured">
        <div
          v-for="item in segments"
          :key="`dummy-${item.label}`"
          class="measure">
          {{ item.label }}
        </div>
      </template>

      <div class="segments-row">
        <div
          v-for="(item, index) in segments"
          :key="index"
          :class="setForegrounded(index)"
          :style="`width: ${item.size}%; height: ${segH}px;`"
          @click="updateParent(index)">

          <template v-if="measured && item.display">

            <span
              v-if="item.above"
              class="segment-label noselect avoid-me"
              :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${item.pos}px`">
              {{ item.label }}
            </span>

            <span
              v-else
              class="segment-label noselect avoid-me"
              :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${-1 * (item.pos) + segH / 2}px`">
              {{ item.label }}
            </span>

            <div
              v-if="item.above"
              class="segment-line avoid-me"
              :style="`top: ${-6}px; height: ${Math.abs(item.pos) - item.labelHeight - 12}px; transform: rotate(180deg);`">
            </div>

            <div
              v-else
              class="segment-line avoid-me"
              :style="`top: ${segH + 6}px; height: ${Math.abs(item.pos) - 26}px`">
            </div>

          </template>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// =================================================================== Functions
const handleLoad = (instance) => {
  instance.handleResize()
}

const initResize = (instance) => {
  clearTimeout(instance.timeOutFunction)
  instance.timeOutFunction = setTimeout(() => { instance.handleResize() }, 250)
}

const calculateSegmentAndLabelPositions = (instance) => {
  const labels = document.querySelectorAll('.measure')
  const segments = document.querySelectorAll('.block-segment')

  const ordered = []
  for (let i = 0; i < labels.length; i++) {
    const score = -1 * ((segments[i].offsetWidth / 2) - labels[i].offsetWidth)
    instance.segments[i].labelHeight = labels[i].offsetHeight
    instance.segments[i].score = score
  }

  const ascending = CloneDeep(instance.segments)
  ascending.sort((a, b) => a.score - b.score)
  for (let i = 0; i < ascending.length; i++) {
    ascending[i].above = i % 2
    ascending[i].pos = (25 + ascending[i].score) * -1
    ascending[i].offset = (25 + ascending[i].score) * -1
  }

  let last, first
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'last') {
        last = ascending.splice(i, 1)
        break
      }
    }
  }
  for (let i = 0; i < ascending.length; i++) {
    if (ascending[i].hasOwnProperty('priority')) {
      if (ascending[i].priority === 'first') {
        first = ascending.splice(i, 1)
        break
      }
    }
  }

  const l = ascending.length
  const s = Math.ceil(l / 2)

  for (let i = 0; i < s; i++) {
    ordered.push(ascending[l - i - 1])
    if (i !== l - i - 1) {
      ordered.push(ascending[i])
    }
  }

  ordered.reverse()

  if (first) { ordered.unshift(first[0]) }
  if (last) { ordered.push(last[0]) }

  for (let i = 0; i < ordered.length - 1; i++) {
    const sum = (ordered[i].above ? 1 : 0) + (ordered[i + 1].above ? 1 : 0)
    if (sum !== 1) {
      if (ordered[i].pos > ordered[i + 1].pos) {
        const p = ordered[i].pos
        ordered[i].pos = ordered[i + 1].pos
        ordered[i + 1].pos = p
        ordered[i].offset = ordered[i].pos
        ordered[i + 1].offset = ordered[i + 1].pos
      }
    }
  }

  instance.measured = true
  instance.segments = ordered
  const col = CloneDeep(instance.segments)
  instance.setSegmentCollection(col)
  handleLoad(instance)
}

const doNotOverlap = (item1, item2, lookahead) => {
  const rect1 = item1.getBoundingClientRect()
  const rect2 = item2.getBoundingClientRect()
  return (
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom + lookahead < rect2.top ||
    rect1.top + lookahead > rect2.bottom
  )
}

const removeMatchingLabel = (instance, label) => {
  const len = instance.segments.length
  for (let i = 0; i < len; i++) {
    if (instance.segments[i].label === label) {
      instance.segments[i].display = false
    }
  }
}

// ====================================================================== Export
export default {
  name: 'ShipyardSegmentSliderChart',

  props: {
    chartItems: {
      type: Array,
      default: () => []
    },
    selectedSeg: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      segH: 30,
      segments: this.chartItems,
      measured: false,
      timeOutFunction: null,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      segmentCollection: 'core/segmentCollection'
    }),
    segmentSliderContent () {
      return this.siteContent.index.page_content.segment_slider
    },
    mobileChartTitle () {
      return this.segmentSliderContent.mobile_chart_title
    }
  },

  watch: {
    selectedSeg (val) {
      if (this.$Countly) {
        const segment = this.segmentCollection[val]
        this.$Countly.trackEvent('Segment Chart | Segment Clicked', {
          label: segment.label,
          slug: segment.slug
        })
      }
    }
  },

  mounted () {
    calculateSegmentAndLabelPositions(this)
    this.resize = () => { initResize(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    ...mapActions({
      setSegmentCollection: 'core/setSegmentCollection'
    }),
    updateParent (seg) {
      this.$emit('update-slider', seg)
    },
    setForegrounded (ind) {
      const x = (this.selectedSeg === ind) ? 'segment-foreground' : 'segment-background'
      return 'block-segment' + ' ' + x
    },
    setMinOffsets (next) {
      for (let ind = 0; ind < this.segments.length; ind++) {
        this.segments[ind].pos = Math.min(-50, this.segments[ind].pos)
      }
      return next()
    },
    reduceOffset (amt, repeats, next) {
      if (repeats > 0) {
        const labels = document.getElementsByClassName('segment-label')
        for (let i = 0; i < this.segments.length; i++) {
          const overlaps = []
          const dir = this.segments[i].above ? amt : (-1 * amt)
          for (let j = 0; j < this.segments.length; j++) {
            if (labels[i] && labels[j] && j !== i) {
              overlaps.push(doNotOverlap(labels[i], labels[j], dir))
            }
          }
          if (overlaps.every(Boolean)) {
            this.segments[i].pos = Math.min(this.segments[i].pos + amt, -20 - this.segments[i].labelHeight)
          }
        }
        const num = repeats - 1
        window.requestAnimationFrame(() => { this.reduceOffset(amt, num, next) })
      } else {
        next()
      }
    },
    dropOverLappingLabels () {
      const labels = document.getElementsByClassName('segment-label')
      const targets = document.getElementsByClassName('avoid-me')
      const overlaps = []
      for (let i = 0; i < labels.length; i++) {
        for (let j = 0; j < targets.length; j++) {
          if (!doNotOverlap(labels[i], targets[j], 0) && targets[j] !== labels[i]) {
            overlaps.push(i)
            break
          }
        }
      }
      if (overlaps.length) {
        const ind = overlaps.pop()
        removeMatchingLabel(this, labels[ind].innerText)
        window.requestAnimationFrame(this.dropOverLappingLabels)
      }
    },
    handleResize () {
      if (window.matchMedia('(max-width: 64rem)').matches) {
        this.$refs.segmentsCtn.classList.remove('segments-large')
        this.$refs.segmentsCtn.classList.add('segments-tiny')
      } else {
        this.$refs.segmentsCtn.classList.remove('segments-tiny')
        this.$refs.segmentsCtn.classList.add('segments-large')
      }
      const len = this.segments.length
      for (let i = 0; i < len; i++) {
        this.segments[i].pos = this.segments[i].offset - 10
        this.segments[i].display = true
      }
      this.reduceOffset(12, 4, () => {
        this.dropOverLappingLabels()
        this.$nextTick(() => { this.$emit('chart-mounted') })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.chart-container {
  position: relative;
  flex: 3 1 42.75rem;
}

.segments-container {
  @include borderRadius_Medium;
  position: relative;
  padding: 0 2.5rem;
  @include medium {
    padding: 0 6rem;
    padding-bottom: 7rem;
  }
  @include small {
    padding: 0 3rem;
    padding-bottom: 0;
  }
  @include tiny {
    min-width: 16rem;
    padding: 0 2rem;
    padding-bottom: 0;
  }
  > div {
    margin: 2px;
  }
}

.chart-title {
  visibility: hidden;
  padding: 4.75rem 0;
  @include medium {
    padding: 2.5rem 0;
  }
  @include small {
    visibility: visible;
    padding: 2rem 0;
  }
}

.segments-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > div {
    margin: 2px;
  }
}

.segments-large {
  min-height: 24rem;
  top: 0px;
}

.segments-tiny {
  min-height: 10rem;
  top: 1.5rem;
}

.space-segment {
  width: 7px;
}

// //////////////////////////////////////////////////////////////////// Segments
.segment-foreground {
  font-weight: bold;
}

.block-segment {
  @include borderRadius_Small;
  position: relative;
  max-width: 20%;
  min-width: 7px;
  cursor: pointer;
  transition: background-color 250ms linear, font-weight 250ms linear;
  &:before {
    @include borderRadius_Small;
    content: '';
    background-color: inherit;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 200ms linear;
  }
  &:hover:before {
    transform: scale(1.02, 1.15);
  }
}

.measure,
.segment-label {
  white-space: normal;
  padding: 0px;
  font-size: 10pt;
  text-align: left;
  transform: translateX(-3px);
  @include small {
    display: none;
  }
}

.measure {
  display: inline-block;
  position: relative;
  max-width: 120px;
  margin: 0 !important;
}

.segment-label {
  position: absolute;
}

.segment-line {
  position: absolute;
  left: 50%;
  width: 2px;
  transform-origin: top left;
  @include small {
    display: none;
  }
}

.noselect {
  user-select: none;
}
</style>
