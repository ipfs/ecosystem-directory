<template>
  <div id="featured-projects-slider">

    <div id="card-display-wrapper">
      <div id="card-display">
        <div id="card-flex" ref="cardFlex" :class="{ sliding: animate }">
          <div
            v-for="(item, index) in projects"
            :key="index"
            class="card-container">

            <div class="card">
              <div class="card-logo">
                <img :src="logos(item.logo)" />
              </div>
            </div>

            <label>{{ item.name }}</label>

            <p>{{ item.description }}</p>
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
import SampleProjects from '~/content/projects/sampleFeaturedProjects.json'

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
      projects: SampleProjects.projects,
      currentIndex: 0,
      range: 0,
      resize: false,
      animate: true
    }
  },

  computed: {
    indices () {
      return this.projects.length - 4
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
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    logos (path) {
      return require('~/assets/logos/' + path)
    },
    setSliderPosition () {
      // 22 is the left and right margin on the card added together
      const amt = this.$refs.cardFlex.firstChild.clientWidth + 22
      this.$refs.cardFlex.style.left = (-1 * this.currentIndex) * amt + 'px'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* .main-wrapper {
    height: 100vh;
    width: 100vw;
    padding-top: 60px;
    overflow-y: scroll;
  }

  .main-container {
    width: 80%;
    margin: 0 auto;
  } */

  /* #featured-title {
    margin-bottom: 16px;
    min-width: 600px;
  } */

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

  #card-flex > div {
    margin: 11px;
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
  }

  .card {
    width: 100%;
    height: 64%;
    border-radius: 6px;
    background-color: #FFFFFF;
    margin-bottom: 16px;
  }

  .card:hover {
    cursor: pointer;
  }

  .card-logo {
    position: relative;
    width: 50%;
    height: 60%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
  }

  img {
    width: 100%;
    height: 100%;
  }

  label { font-weight: bold; }
  p { font-size: 10pt; }

  /* SLIDER */

  #slider {
    margin: 2% auto;
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
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: #D4D4D4;
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
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: #D4D4D4;
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
    height: 4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  input[type=range]::-ms-fill-lower {
    background: #D4D4D4;
  }
  input[type=range]::-ms-fill-upper {
    background: #D4D4D4;
    border-radius: 20px;
  }
  input[type=range]::-ms-thumb {
    margin-top: 1px;
    height: 20px;
    width: 50px;
    cursor: pointer;
  }

</style>
