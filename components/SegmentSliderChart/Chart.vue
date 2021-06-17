<template>
  <div ref="chartFlex" class="chart-container">
    <div ref="segmentsCtn" class="segments-container">

      <div class="chart-title">
        <h3>{{ mobileChartTitle }}</h3>
      </div>

      <div class="segments-row">
        <div
          v-for="(item, index) in segments"
          :key="index"
          :class="setForegrounded(index)"
          :style="`width: ${item.size}%; height: ${segH}px;`"
          @click="updateParent(index)">

          <template v-if="item.display">

            <span
              v-if="item.above"
              class="segment-label noselect avoid-me"
              :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${item.pos - (item.chars < 16 ? 0 : 21)}px`">{{ item.cat }}</span>

            <span
              v-else
              class="segment-label noselect avoid-me"
              :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${-1 * (item.pos) + segH / 2}px`">{{ item.cat }}</span>

            <div
              v-if="item.above"
              class="segment-line avoid-me"
              :style="`top: ${-6}px; height: ${Math.abs(item.pos) - 26}px; transform: rotate(180deg);`">
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
// =================================================================== Functions
import { mapGetters } from 'vuex'

const handleLoad = (instance) => {
  instance.handleResize()
}

const initResize = (instance) => {
  clearTimeout(instance.timeOutFunction)
  instance.timeOutFunction = setTimeout(() => { instance.handleResize() }, 250)
}

// ====================================================================== Export
export default {
  name: 'Chart',

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
      timeOutFunction: null,
      load: false,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    segmentSliderContent () {
      return this.siteContent.index.page_content.segment_slider
    },
    mobileChartTitle () {
      return this.segmentSliderContent.mobile_chart_title
    }
  },

  mounted () {
    this.load = () => { handleLoad(this) }
    window.addEventListener('load', this.load)
    this.resize = () => { initResize(this) }
    window.addEventListener('resize', this.resize)

    this.handleResize()
  },

  beforeDestroy () {
    if (this.load) { window.removeEventListener('load', this.load) }
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    updateParent (seg) {
      this.$emit('update-slider', seg)
    },
    setForegrounded (ind) {
      const x = (this.selectedSeg === ind) ? 'segment-foreground' : 'segment-background'
      return 'block-segment' + ' ' + x
    },
    forceLabelsOut (next) {
      if (this.$refs.chartFlex) {
        for (let ind = 0; ind < this.segments.length; ind++) {
          this.segments[ind].pos = this.segments[ind].offset + this.segments[ind].force * (20000 / this.$refs.chartFlex.clientWidth)
        }
      }
      return next()
    },
    setMinOffsets (next) {
      for (let ind = 0; ind < this.segments.length; ind++) {
        this.segments[ind].pos = Math.min(-50, this.segments[ind].pos)
      }
      return next()
    },
    repositionOverlappingLabels (next) {
      const labels = document.querySelectorAll('.segment-label')
      const lines = document.querySelectorAll('.segment-line')

      for (let ind = 0; ind < this.segments.length - 1; ind++) {
        if (labels[ind]) {
          const label = labels[ind].getBoundingClientRect()
          const mirror = {
            left: label.left,
            right: label.right,
            top: label.top + 2 * (this.segments[ind].pos) + this.segH,
            bottom: label.bottom + 2 * (this.segments[ind].pos) + this.segH
          }

          for (let j = ind + 1; j < Math.min(labels.length, ind + 4); j++) {
            if (labels[j] && lines[j]) {
              const test1 = labels[j].getBoundingClientRect()
              const test2 = lines[j].getBoundingClientRect()

              const isOverlappingTopLabel = !(label.right < test1.left || label.left > test1.right || label.bottom < test1.top || label.top > test1.bottom)
              const isOverlappingTopLine = !(label.right < test2.left || label.left > test2.right || label.bottom < test2.top || label.top > test2.bottom)
              const willOverlappingBottomLabel = !(mirror.right < test1.left || mirror.left > test1.right || mirror.bottom < test1.top || mirror.top > test1.bottom)
              const willOverlappingBottomLine = !(mirror.right < test2.left || mirror.left > test2.right || mirror.bottom < test2.top || mirror.top > test2.bottom)

              if (isOverlappingTopLabel || isOverlappingTopLine) {
                if (!willOverlappingBottomLabel && !willOverlappingBottomLine) {
                  if (this.segments[ind].pos < this.segments[j].pos) {
                    this.segments[ind].above = !this.segments[ind].above
                    j = labels.length
                  } else {
                    this.segments[j].above = !this.segments[j].above
                    j = labels.length
                  }
                }
              }
            }
          }
        }
      }
      return next()
    },
    reduceOffset (amt, next) {
      const labels = document.querySelectorAll('.segment-label')
      for (let i = 0; i < this.segments.length; i++) {
        const overlaps = []
        const dir = this.segments[i].above ? amt : (-1 * amt)
        for (let j = 0; j < this.segments.length; j++) {
          if (j !== i) {
            if (labels[i] && labels[j]) {
              const rect1 = labels[i].getBoundingClientRect()
              const rect2 = labels[j].getBoundingClientRect()
              const isNotOverlapping = (
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom + dir < rect2.top ||
                rect1.top + dir > rect2.bottom
              )
              overlaps.push(isNotOverlapping)
            }
          }
        }
        const result = overlaps.every(Boolean)
        if (result) {
          this.segments[i].pos += amt
        }
      }
      return next()
    },
    dropOverLappingLabels () {
      const targets = document.querySelectorAll('.avoid-me')
      const labels = document.querySelectorAll('.segment-label')

      const overlaps = []
      for (let i = 0; i < labels.length; i++) {
        const arr = []
        for (let j = 0; j < targets.length; j++) {
          if (targets[j] !== labels[i]) {
            if (labels[i] && targets[j]) {
              const rect1 = labels[i].getBoundingClientRect()
              const rect2 = targets[j].getBoundingClientRect()
              const isNotOverlapping = (
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom
              )
              arr.push(isNotOverlapping)
            }
          }
        }
        const result = arr.every(Boolean)
        overlaps.push(!result)
      }
      const indices = overlaps.reduce(
        (out, bool, index) => bool ? out.concat(index) : out,
        []
      )
      for (let i = 1; i < indices.length + 1; i++) {
        if (i in indices) {
          if ((indices[i - 1] + 1) === indices[i]) {
            const x = indices[i]
            this.segments[x].display = false
          }
        }
      }
    },
    handleResize () {
      if (window.matchMedia('(max-width: 64rem)').matches) {
        this.$refs.segmentsCtn.classList.remove('segments-large')
        this.$refs.segmentsCtn.classList.add('segments-tiny')
      } else {
        this.$refs.segmentsCtn.classList.remove('segments-tiny')
        this.$refs.segmentsCtn.classList.add('segments-large')
        this.segments.forEach((segment) => { segment.display = true })
        this.forceLabelsOut(() => {
          this.repositionOverlappingLabels(() => {
            this.reduceOffset(25, () => {
              this.setMinOffsets(() => {
                setTimeout(() => {
                  this.dropOverLappingLabels()
                  this.$emit('chart-mounted')
                }, 500)
              })
            })
          })
        })
      }
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
  @include borderRadius3;
  position: relative;
  padding: 0 2.5rem;
  @include medium {
    padding-bottom: 7rem;
  }
  @include small {
    padding-bottom: 0;
  }
  > div {
    margin: 2px;
  }
}

.chart-title {
  font-family: $fontMontserrat;
  color: #181818;
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
  background-color: #ffffff;
  min-height: 10rem;
  top: 1.5rem;
}

.space-segment {
  width: 7px;
}

// //////////////////////////////////////////////////////////////////// Segments
.segment-foreground {
  background-color: #052437;
  font-weight: bold;
}

.segment-background {
  background-color: #3D8F96;
}

.block-segment {
  @include borderRadius2;
  position: relative;
  max-width: 20%;
  min-width: 7px;
  transition: background-color 250ms linear, font-weight 250ms linear;
  &:before {
    content: '';
    background-color: inherit;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    @include borderRadius2;
    transition: transform 200ms linear;
  }
  &:hover:before {
    transform: scale(1.02, 1.15);
  }
}

.segment-label {
  position: absolute;
  white-space: normal;
  padding: 0px;
  font-size: 10pt;
  text-align: left;
  transform: translateX(-3px);
  @include small {
    display: none;
  }
}

.segment-line {
  position: absolute;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.1);
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
