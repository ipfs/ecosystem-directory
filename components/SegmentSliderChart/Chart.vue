<template>
  <div ref="chartFlex" class="chart-container chart-flex">

    <div
      v-for="(item, index) in segments"
      :key="index"
      :class="setForegrounded(index)"
      :style="`width: ${item.size}px; height: ${segH}px;`"
      @click="updateParent(index)">

      <span
        v-if="item.above"
        class="segment-label noselect"
        :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${item.pos - (item.chars < 16 ? 0 : 21)}px`">
        {{ item.cat }}
      </span>

      <span
        v-else
        class="segment-label noselect"
        :style="`width: ${Math.min(item.chars, 15) * 8}px; top: ${-1 * (item.pos) + segH / 2}px`">
        {{ item.cat }}
      </span>

      <div
        v-if="item.above"
        class="segment-line"
        :style="`transform: translateY(${item.pos + 21}px); height: ${-1 * (item.pos + 28)}px`">
      </div>

      <div
        v-else
        class="segment-line"
        :style="`transform: translateY(${segH + 8}px); height: ${-1 * (item.pos + segH + 8) + segH / 2}px`">
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Functions
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

  mounted () {
    this.load = () => { handleLoad(this) }
    window.addEventListener('load', this.load)
    this.resize = () => { initResize(this) }
    window.addEventListener('resize', this.resize)

    this.handleResize()
  },

  beforeDestroy () {
    if (this.load) { window.removeEventListener('resize', this.load) }
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
      for (let ind = 0; ind < this.segments.length; ind++) {
        this.segments[ind].pos = this.segments[ind].offset + this.segments[ind].force * (20000 / this.$refs.chartFlex.clientWidth)
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
      const labels = document.getElementsByClassName('segment-label')
      const lines = document.getElementsByClassName('segment-line')

      for (let ind = 0; ind < this.segments.length - 1; ind++) {
        const label = labels[ind].getBoundingClientRect()
        const mirror = {
          left: label.left,
          right: label.right,
          top: label.top + 2 * (this.segments[ind].pos) + this.segH,
          bottom: label.bottom + 2 * (this.segments[ind].pos) + this.segH
        }
        for (let j = ind + 1; j < Math.min(labels.length, ind + 4); j++) {
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
      return next()
    },
    reduceOffset (amt, next) {
      const labels = document.getElementsByClassName('segment-label')
      for (let i = 0; i < this.segments.length; i++) {
        const overlaps = []
        const dir = this.segments[i].above ? amt : (-1 * amt)
        for (let j = 0; j < this.segments.length; j++) {
          if (j !== i) {
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
        const result = overlaps.every(Boolean)
        if (result) {
          this.segments[i].pos += amt
        }
      }
      return next()
    },
    handleResize () {
      this.forceLabelsOut(() => {
        this.repositionOverlappingLabels(() => {
          this.reduceOffset(25, () => {
            this.setMinOffsets(() => {
              setTimeout(() => {
                this.forceLabelsOut(() => {
                  this.repositionOverlappingLabels(() => {
                    setTimeout(() => {
                      this.setMinOffsets(() => {
                        for (let r = 0; r < 30; r++) {
                          setTimeout(() => {
                            this.reduceOffset(4, () => {
                              this.setMinOffsets(() => null)
                            })
                          }, 10 * r)
                        }
                      })
                    }, 10)
                  })
                })
              }, 10)
            })
          })
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.chart-container {
  width: 75%;
  min-height: 24rem;
  padding: 20px;
  padding-right: 50px;
}

.chart-flex {
  position: relative;
  top: 20px;
  flex-grow: 3;
  flex-shrink: 0;
  flex-basis: 33.3333%;
  flex-basis: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > div {
    margin: 2px;
  }
}

.space-segment {
  width: 7px;
}

// //////////////////////////////////////////////////////////////////// Segments
.segment-foreground {
  background-color: rgb(2, 28, 54);
  font-weight: bold;
}

.segment-background {
  background-color: rgb(24, 150, 150);
}

.block-segment {
  @include borderRadius2;
  position: relative;
  max-width: 20%;
  min-width: 7px;
  transition: background-color 250ms linear, font-weight 250ms linear;
}

.segment-label {
  position: absolute;
  white-space: normal;
  font-size: 10pt;
  text-align: left;
  transform: translateX(-3px)
}

.segment-line {
  position: absolute;
  left: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  width: 2px;
}

.noselect {
  user-select: none;
}
</style>
