<template>
  <div id="featured-projects-slider">

    <div id="card-display-wrapper">
      <div id="card-display">
        <div
          v-if="featured"
          id="card-flex"
          ref="cardFlex"
          :class="{ sliding: animate }">
          <div
            v-for="(project, index) in featured"
            :key="index"
            class="col-3 card-container">

            <div class="card">
              <div class="card-logo">

                <img :src="$relativity(`/images/${project.logo.icon}`)" />

              </div>
            </div>

            <label>{{ (typeof project.name === 'string') ? project.name : '' }}</label>

            <p>{{ (typeof project.description.short === 'string') ? project.description.short : '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <div id="slider">
      <div id="slider-line">
        <input
          id="feature-range-slider"
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

// ===================================================================== Functions
const handleFeatureSliderResize = (instance) => {
  instance.animate = false
  instance.setSliderPosition()
}

// ====================================================================== Export
export default {
  name: 'Main',

  data () {
    return {
      currentIndex: 0,
      range: 0,
      resize: false,
      animate: true
    }
  },

  computed: {
    ...mapGetters({
      projects: 'projects/projects'
    }),
    featured () {
      const arr = []
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].featured) {
          arr.push(this.projects[i])
        }
      }
      if (arr.length) {
        return arr
      }
      return false
    },
    indices () {
      return this.featured.length - 4
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
    this.resize = () => { handleFeatureSliderResize(this) }
    window.addEventListener('resize', this.resize)
    this.$emit('init')
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    setSliderPosition () {
      if (this.$refs.cardFlex) {
        const amt = this.$refs.cardFlex.firstChild.clientWidth
        this.$refs.cardFlex.style.left = (-1 * this.currentIndex) * amt + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  h4 { font-weight: 400; }

  /* CARDS */

  #card-display-wrapper {
    min-width: 600px;
  }

  #card-display {
    margin: 0 5%;
    overflow: hidden;
  }

  #card-flex {
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    position: relative;
    left: 0px;
  }

  .sliding {
    transition: left 300ms ease-in-out;
  }

  .card-container {
    height: 250px;
    width: 25%;
    min-width: calc(25% - 22px);
    max-width: calc(50% - 22px);
    flex-basis: auto;
    flex-grow: 1;
    label {
      @include leading_Small;
      font-weight: 600;
      font-size: 15pt;
      font-family: $fontMontserrat;
      color: $tiber;
    }
    p {
      @include leading_Small;
      color: $tundora;
      font-size: 10pt;
    }
  }

  .card {
    width: 100%;
    height: 64%;
    @include borderRadius3;
    background-color: #FFFFFF;
    margin-bottom: 16px;
    &:hover{
      cursor: pointer;
    }
  }

  .card-logo {
    position: relative;
    max-width: 6rem;
    height: 60%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
    img {
      height: 100%;
    }
  }

  /* SLIDER */

  #slider {
    margin: 1.5rem auto;
    display: flex;
    justify-content: center;
    min-width: 600px;
  }

  #slider-line {
    display: inline-block;
    width: 40%;
  }

  #feature-range-slider {
    width: 100%;
  }

  input[type=range] {
    height: 28px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    animate: 0.2s;
    background: #D7D9D8;
    border-radius: 20px;
    border: 0px solid #000101;
  }
  input[type=range]::-webkit-slider-thumb {
    height: 20px;
    width: 50px;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -9px;
    background: url('./sliderthumb.svg') no-repeat;
  }
  input[type=range]::-moz-range-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    animate: 0.2s;
    background: #D7D9D8;
    border-radius: 20px;
    border: 0px solid #000101;
  }
  input[type=range]::-moz-range-thumb {
    height: 20px;
    width: 50px;
    cursor: pointer;
  }

  input[type=range]::-ms-track {
    width: 100%;
    height: 3px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #D7D9D8;
  }
  input[type=range]::-ms-fill-upper {
    background: #D7D9D8;
    border-radius: 20px;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    height: 20px;
    width: 50px;
    cursor: pointer;
  }

</style>
