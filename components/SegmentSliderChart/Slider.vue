<template>
  <div class="slider-container slider-flex" :style="{ height: `${containerHeight}px` }">
    <div class="slider-card">

      <div class="aside-nav">
        <button
          class="nav-arrow"
          @click="incrementSelection(selectedSeg - 1)">&#8249;</button>
        <button
          class="nav-arrow"
          @click="incrementSelection(selectedSeg + 1)">&#8250;</button>
      </div>

      <transition name="slide-fade" mode="out-in">
        <div :key="selectedCat">
          <h3>{{ selectedCat }}</h3>
          <p class="slider-card-text">
            {{ excerpt }}
          </p>
          <div class="img-container">
            <img :src="$relativity(image)" style="width: 100%;" alt="" />
          </div>
        </div>
      </transition>

      <button class="project-view button noselect">
        View 53 Projects
      </button>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import icons from '@/components/SegmentSliderChart/icons.png'

// ====================================================================== Export
export default {
  name: 'Slider',
  props: {
    selectedCat: {
      type: String,
      default: ''
    },
    selectedSeg: {
      type: Number,
      default: 0
    },
    containerHeight: {
      type: Number,
      default: 440
    },
    excerpt: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      image: icons
    }
  },
  methods: {
    incrementSelection (seg) {
      this.$emit('update-slider', seg)
    }
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////////////// Slider
.slider-container {
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0em 1.0em;
}

.slider-flex {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-card {
  background-color: #ffffff;
  width: 80%;
  height: 80%;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  align-items: center;
}

.slider-card-text {
  padding: 10px;
  font-size: 10pt;
  font-weight: 500;
}

.nav-arrow {
  color: rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 900;
  font-size: 16pt;
  width: 40px;
  &:hover {
    color: rgb(2, 28, 54);
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.img-container {
  width: 70%;
  max-width: 300px;
  margin: 0 auto;
}

.project-view {
  color: white;
  background-color: rgb(2, 28, 54);
  bottom: 0px;
  transform: translateY(50%);
}

.button {
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: 700;
  text-align: center;
  padding: 0.5em 2.0em;
  text-decoration: none;
  border: none;
  border-radius: 6px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.noselect {
  user-select: none;
}

// ////////////////////////////////////////////////////////////////// Animations
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all .25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
