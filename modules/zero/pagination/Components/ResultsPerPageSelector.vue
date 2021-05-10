<template>
  <div class="dropdown dropdown-selector-wrapper">
    
    <label
      v-if="selected">
      {{ msg + (selected === totalItems ? 'All' : selected) }}
    </label>
    <label
      v-else>
      {{ msg + display }}
    </label>

    <button
      class="dropdown dropdown-button"
      @click="toggleDropDown()">
      <svg
        class="dropdown"
        xmlns="http://www.w3.org/2000/svg"
        width="8.841"
        height="5.798"
        viewBox="0 0 8.841 5.798">
        <g
          class="dropdown"
          transform="translate(7.781 1.06) rotate(90)">
          <path
            class="dropdown"
            d="M0,0,3.679,3.36"
            stroke="#181818"
            stroke-linecap="round"
            stroke-width="1.5" />
          <path
            class="dropdown"
            d="M0,3.36,3.679,0"
            transform="translate(0 3.362)"
            stroke="#181818"
            stroke-linecap="round"
            stroke-width="1.5" />
        </g>
      </svg>
    </button>

    <div
      class="dropdown dropdown-list"
      :class="{ hidden: closed }">
      <template v-for="option in options">
        <div
          v-if="!isNaN(option)"
          :key="`div-option-${option}`"
          :value="{option}"
          class="dropdown dropdown-item"
          :class="{ highlighted: (display === option) }"
          @click="optionSelected(option)">
          {{ (option === totalItems ? 'All' : option) }}
        </div>
      </template>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ===================================================================== Functions
const closeAllSelect = (e, instance) => {
  const options = document.getElementsByClassName('dropdown')
  const results = []
  for (let i = 0; i < options.length; i++) {
    results.push(options[i] !== e.target)
  }
  if (results.every(bool => bool)) {
    instance.closed = true
  }
}

// ====================================================================== Export
export default {
  name: 'ResultsPerPageSelector',

  props: {
    msg: {
      type: String,
      required: false,
      default: 'Results per page: '
    },
    displayOptions: {
      type: Array,
      required: false,
      default: () => [10, 20, 50]
    },
    collection: {
      type: [Boolean, Array],
      required: false,
      default: false
    }
  },

  data () {
    return {
      selected: this.display,
      closed: true,
      unfocus: false
    }
  },

  computed: {
    ...mapGetters({
      page: 'pagination/page',
      totalPages: 'pagination/totalPages',
      display: 'pagination/display'
    }),
    totalItems () {
      return this.collection.length
    },
    options () {
      const displayOptions = this.displayOptions
      const current = this.display
      const total = this.collection.length
      if (!displayOptions.includes(current)) {
        displayOptions.push(current)
      }
      if (!displayOptions.includes(total)) {
        displayOptions.push(total)
      }
      displayOptions.sort((a, b) => a - b)
      return displayOptions
    }
  },

  mounted () {
    this.unfocus = (e) => { closeAllSelect(e, this) }
    window.addEventListener('click', this.unfocus)
  },

  beforeDestroy () {
    if (this.unfocus) { window.removeEventListener('click', this.unfocus) }
  },

  methods: {
    ...mapActions({
      setDisplay: 'pagination/setDisplay',
      setTotalPages: 'pagination/setTotalPages'
    }),
    calculateTotalPages () {
      const total = Math.ceil(this.collection.length / this.display)
      this.setTotalPages(total)
    },
    toggleDropDown () {
      this.closed = !this.closed
    },
    optionSelected (val) {
      const selection = parseInt(val)
      if (!isNaN(selection)) {
        this.selected = selection
        this.setDisplay(selection)
        this.calculateTotalPages()
        if (this.page > this.totalPages) {
          this.$router.push({
            query: { page: this.totalPages }
          })
        }
      }
      this.closed = true
    }
  }
}
</script>

<style lang="scss" scoped>

  ::selection {
    color: none;
    background: none;
  }

  ::-moz-selection {
    color: none;
    background: none;
  }

  .hidden {
    display: none;
  }

  .dropdown-button {
    transform: translateY(-5%);
    opacity: 0.5;
  }

  .dropdown-button:hover {
    cursor: pointer;
    opacity: 1.0;
  }

  .dropdown-list {
    background-color: #ffffff;
    position: absolute;
    right: 1.0rem;
    top: 2.5rem;
    border-radius: 6px;
    overflow: hidden;
  }

  .dropdown-item {
    padding: 0.25rem 0.75rem;
  }

  .dropdown-item:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .highlighted {
    background-color: #6BC4CE;
    color: white;
  }

</style>
