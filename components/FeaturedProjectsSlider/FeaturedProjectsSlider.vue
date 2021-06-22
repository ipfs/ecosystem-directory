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

          <ProjectCard
            v-for="(project, index) in featured"
            :key="index"
            :title="project.name"
            :slug="project.slug"
            :description="project.description.short"
            :logo="project.logo.icon"
            :style="{ width: `${cardWidth}px` }"
            format="block-view" />

        </div>
      </div>
    </div>

    <div id="slider-controls">
      <div id="slider-line">
        <input
          id="feature-range-slider"
          ref="sliderInput"
          v-model="range"
          type="range"
          step="0.1"
          :min="indices / 2"
          :max="indices * indices + 1">
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ProjectCard from '@/components/ProjectView/ProjectCard'

// =================================================================== Functions
const handleFeatureSliderResize = (instance) => {
  const display = instance.display
  if (window.matchMedia('(max-width: 53.125rem)').matches) { // small
    if (window.matchMedia('(max-width: 40rem)').matches) { // mini
      if (display !== 2) { instance.display = 2 }
    } else {
      if (display !== 3) { instance.display = 3 }
    }
  } else {
    if (display !== 4) { instance.display = 4 }
  }
  const cardWidth = instance.$refs.cardRowContainer.clientWidth / instance.display
  instance.animate = false
  instance.cardWidth = cardWidth
  instance.slidingRowWidth = cardWidth * instance.featured.length + 'px'
  instance.setSliderPosition()
}

// ====================================================================== Export
export default {
  name: 'Main',

  components: {
    ProjectCard
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
      slidingRowWidth: '100%'
    }
  },

  computed: {
    ...mapGetters({
      projects: 'projects/projects'
    }),
    featured () {
      return this.projects.filter(project => project.featured)
    },
    indices () {
      return this.featured.length - this.display
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
    this.$emit('init')
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
.project-card {
  padding-bottom: 0;
}

// ///////////////////////////////////////////////////////////// Slider Controls
#slider-controls {
  display: flex;
  justify-content: center;
  margin: 1.5rem auto;
}

#slider-line {
  display: inline-block;
  width: 40%;
  @include tiny {
    width: 75%;
  }
}

#feature-range-slider {
  width: 100%;
}

// ////////////////////////////////////////////////////////////////////// Inputs
input {
  &[type=range] {
    height: 28px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      animate: 0.2s;
      background: #D7D9D8;
      border-radius: 20px;
      border: 0px solid #000101;
    }
    &::-webkit-slider-thumb {
      height: 20px;
      width: 51px;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -9px;
      background: url('./sliderthumb.svg') no-repeat;
    }
    &::-moz-range-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      animate: 0.2s;
      background: #D7D9D8;
      border-radius: 20px;
      border: 0px solid #000101;
    }
    &::-moz-range-thumb {
      height: 20px;
      width: 51px;
      cursor: pointer;
      background: url('./sliderthumb.svg') no-repeat;
      border: none;
      border-radius: 0px;
    }
    &::-ms-track {
      width: 100%;
      height: 3px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    &::-ms-fill-lower {
      background: #D7D9D8;
    }
    &::-ms-fill-upper {
      background: #D7D9D8;
      border-radius: 20px;
    }
    &::-ms-thumb {
      margin-top: 1px;
      height: 20px;
      width: 51px;
      cursor: pointer;
      background: url('./sliderthumb.svg') no-repeat;
      border: none;
      border-radius: 0px;
    }
  }
}
</style>
