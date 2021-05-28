<template>
  <div class="slider-container">
    <div class="slider-card">

      <div class="slide-nav">

        <button
          class="nav-arrow"
          @click="incrementSelection(selectedSeg - 1)">
          <PrevArrow
            stroke="#052437"
            width="10"
            height="15" />
        </button>

        <button
          class="nav-arrow"
          @click="incrementSelection(selectedSeg + 1)">
          <NextArrow
            stroke="#052437"
            width="10"
            height="15" />
        </button>

      </div>

      <transition name="slide-fade" mode="out-in">

        <div :key="selectedCat.cat">

          <h3>{{ selectedCat.cat }}</h3>

          <p class="slider-card-text">
            {{ excerpt }}
          </p>

          <div v-if="logos" class="logo-wrapper">

            <img
              v-for="path in logos"
              :key="path"
              :src="$relativity(`/images/projects/${path}`)" />

          </div>

        </div>
      </transition>

      <button
        class="view-all button noselect"
        @click="jump2Filters">
        View All
      </button>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import PrevArrow from '@/components/Icons/PrevArrow'
import NextArrow from '@/components/Icons/NextArrow'

// =================================================================== Functions
const getLogoPaths = (instance) => {
  instance.iconPaths = [
    'actyx.svg',
    'alpress.svg',
    'anytype.svg',
    'audius.svg',
    'berty.svg',
    'bravebrowser.svg',
    'pinata.svg'
  ]
}

// ====================================================================== Export
export default {
  name: 'Slider',

  components: {
    PrevArrow,
    NextArrow
  },

  props: {
    selectedCat: {
      type: Object,
      required: true
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
      iconPaths: []
    }
  },

  computed: {
    logos () {
      if (this.selectedCat.logos.length) {
        return this.selectedCat.logos
      }
      return false
    }
  },

  mounted () {
    getLogoPaths(this)
  },

  methods: {
    incrementSelection (seg) {
      this.$emit('update-slider', seg)
    },
    jump2Filters () {
      this.$nuxt.$emit('view-all-projects')
    }
  }
}
</script>

<style lang="scss" scoped>
// ////////////////////////////////////////////////////////////////////// Slider
.slider-container {
  display: flex;
  width: 17rem;
  align-items: center;
  padding: 1.0rem 1.5rem;
  padding-left: 0.5rem;
}

.slider-card {
  @include borderRadius3;
  background-color: #ffffff;
  width: 100%;
  min-height: 20rem;
  padding: 1rem;
  position: relative;
  align-items: center;
  h3 {
    line-height: 1.5;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}

.slider-card-text {
  @include fontSize_Small;
  font-weight: 400;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: #494949;
}

.slide-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.75rem 0;
}

.nav-arrow {
  @include borderRadius3;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  color: rgba(0, 0, 0, 0.5);
  background-color: #FFFFFF;
  border: none;
  font-weight: 900;
  width: 3.75rem;
  &:hover {
    color: rgb(2, 28, 54);
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  max-width: 300px;
  margin: 0 auto;
  margin-bottom: 1.5rem;
  img {
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

.logo-wrapper {
  > img {
    margin: 0 0.75rem;
    max-width: 25%;
    max-height: 2.5rem;
  }
}

.view-all {
  width: 70%;
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-weight: 500;
  text-align: center;
  padding: 0.25em 2.0em;
  text-decoration: none;
  border: none;
  @include borderRadius3;
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
