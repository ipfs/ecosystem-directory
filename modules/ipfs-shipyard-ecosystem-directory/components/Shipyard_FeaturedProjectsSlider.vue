<template>
  <div v-if="featured.length > 0" id="featured-projects-slider">

    <div id="slider">
      <div
        id="card-row-container"
        ref="cardRowContainer"
        v-hammer:swipe.horizontal="onSwipe">
        <div
          id="card-row"
          ref="cardRow"
          :class="{ sliding: animate }"
          :style="{ left: `${left}px`, width: slidingRowWidth }">

          <div
            v-for="(project, index) in featured"
            :key="index"
            :style="{ width: `${cardWidth}px` }"
            class="click-wrapper"
            @click="projectCardClicked(project)">
            <Shipyard_ProjectCard
              :title="project.name"
              :slug="project.slug"
              :description="project.description.short"
              :logo="project.logo.icon"
              :url="project.primaryCta.url"
              :navigation-behavior="projectCardBehavior"
              :enable-image-alt="enableImageAlt"
              format="block-view" />
          </div>

        </div>
      </div>
    </div>

    <div id="slider-controls">
      <div id="slider-line">
        <div class="dummy-thumb" :style="`left: ${thumbPosition}px;`">
          <SelectorToggleIcon class="chevron-left" />
          <SelectorToggleIcon class="chevron-right" />
        </div>
        <input
          id="feature-range-slider"
          ref="sliderInput"
          v-model="range"
          type="range"
          step="0.1"
          class="focus-visible"
          :min="indices / 2"
          :max="indices * indices + 1">
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'

// =================================================================== Functions
const handleFeatureSliderResize = (instance) => {
  const display = instance.display
  if (window.matchMedia('(max-width: 25.9375rem)').matches) {
    if (display !== 1) { instance.display = 1 }
  } else if (window.matchMedia('(max-width: 40rem)').matches) {
    if (display !== 2) { instance.display = 2 }
  } else if (window.matchMedia('(max-width: 53.125rem)').matches) {
    if (display !== 3) { instance.display = 3 }
  } else {
    if (display !== 4) { instance.display = 4 }
  }
  if (instance.currentIndex > instance.indices) {
    instance.currentIndex = instance.indices
  }
  const cardWidth = instance.$refs.cardRowContainer.clientWidth / instance.display
  instance.animate = false
  instance.cardWidth = cardWidth
  instance.slidingRowWidth = cardWidth * instance.featured.length + 'px'
  instance.setSliderPosition()

  instance.inputWidth = instance.$refs.sliderInput.getBoundingClientRect().width
}

// ====================================================================== Export
export default {
  name: 'ShipyardFeaturedProjectsSlider',

  components: {
    SelectorToggleIcon
  },

  props: {
    parent: { // name of parent page, used for Countly
      type: String,
      required: true
    }
  },

  data () {
    return {
      currentIndex: 0,
      range: 0,
      resize: false,
      animate: true,
      left: 0,
      cardWidth: 0,
      display: 4,
      slidingRowWidth: '100%',
      inputWidth: false
    }
  },

  computed: {
    ...mapGetters({
      projects: 'projects/projects',
      settings: 'global/settings'
    }),
    featured () {
      return this.projects.filter(project => project.featured)
    },
    indices () {
      return this.featured.length - this.display
    },
    projectCardBehavior () {
      return parseInt(this.settings.visibility.disableSingulars)
    },
    enableImageAlt () {
      return this.settings.visibility.mediaAltAtts
    },
    thumbPosition () {
      const pos = (this.range - (this.indices / 2)) / ((this.indices * this.indices + 1) - (this.indices / 2))
      return Math.max(pos * (this.inputWidth - 48), 0)
    }
  },

  watch: {
    range (val) {
      this.animate = true
      const index = Math.trunc((val - (val % this.indices)) / this.indices)
      this.currentIndex = Math.max(0, Math.min(index, this.indices))
      this.setSliderPosition()
    }
  },

  mounted () {
    handleFeatureSliderResize(this)
    this.resize = () => { handleFeatureSliderResize(this) }
    window.addEventListener('resize', this.resize)
    this.$nextTick(() => { this.$emit('init') })
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    setSliderPosition () {
      this.left = (-1 * this.currentIndex) * this.cardWidth
    },
    onSwipe (e) {
      const ind = this.currentIndex
      const min = parseFloat(this.$refs.sliderInput.min)
      const max = parseFloat(this.$refs.sliderInput.max)
      const rng = max - min
      if (ind < this.indices && e.type === 'swipeleft') {
        this.range = min + (rng * (ind + 1) / this.indices)
      }
      if (ind > 0 && e.type === 'swiperight') {
        this.range = min + (rng * (ind - 1) / this.indices)
      }
    },
    projectCardClicked (project) {
      if (this.$Countly) {
        this.$Countly.trackEvent('Featured Slider | Project Card Clicked', {
          name: project.name,
          slug: project.slug,
          from: this.parent
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#slider {
  margin: 0 $containerSingleColumn;
  overflow: hidden;
  @include medium {
    margin: 0;
  }
}

#card-row {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  box-sizing: border-box;
  position: relative;
  left: 0px;
}

#card-row-container {
  width: 100%;
}

.sliding {
  transition: left 300ms ease-in-out;
}

// /////////////////////////////////////////////////////////////////////// Cards
::v-deep .project-card {
  display: block;
  padding-bottom: 0;
  @include tiny {
    padding: 0;
    &:not(.list-view) {
      .content {
        margin-bottom: 0;
      }
    }
  }
}

// ///////////////////////////////////////////////////////////// Slider Controls
#slider-controls {
  display: flex;
  justify-content: center;
  margin: 1.5rem auto;
}

#slider-line {
  position: relative;
  display: block;
  width: 40%;
  @include tiny {
    width: 75%;
  }
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 0px;
    border: 1px solid $gray400;
    transform: translateY(-50);
    border-radius: 10px;
    z-index: -10;
  }
}

#feature-range-slider {
  width: 100%;
}

// ////////////////////////////////////////////////////////////////////// Inputs
.dummy-thumb {
  position: absolute;
  height: 20px;
  width: 50px;
  background-color: #ffffff;
  border: 2px solid $gray400;
  border-radius: $borderRadius_Medium;
  z-index: -1;
  top: 50%;
  transform: translateY(-50%);
}

.chevron-left,
.chevron-right {
  position: relative;
  top: -6px;
}

.chevron-left {
  transform: rotateZ(90deg) scale(0.9);
  left: 2px;
}

.chevron-right {
  transform: rotateZ(-90deg) scale(0.9);
  left: 16px;
}

@mixin thumb() {
  height: 20px;
  width: 50px;
  cursor: pointer;
  border-radius: 0px;
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: $borderRadius_Medium;
}

input {
  &[type=range] {
    height: 28px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    z-index: 10000;
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 0px;
      cursor: pointer;
      animate: 0.2s;
      border-radius: 20px;
      background-color: transparent;
      border-color: transparent;
      color: transparent;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: -9px;
      @include thumb
    }
    &::-moz-range-track {
      width: 100%;
      height: 0px;
      cursor: pointer;
      animate: 0.2s;
      border-radius: 20px;
      background-color: transparent;
      border-color: transparent;
      color: transparent;
    }
    &::-moz-range-thumb {
      @include thumb
    }
    &::-ms-track {
      width: 100%;
      height: 0px;
      cursor: pointer;
      background-color: transparent;
      border-color: transparent;
      color: transparent;
    }
    &::-ms-fill-upper {
      border-radius: 20px;
    }
    &::-ms-thumb {
      margin-top: 1px;
      @include thumb
    }
  }
}
</style>
