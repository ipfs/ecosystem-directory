<template>
  <component :is="rootNode">

    <div class="dropdown dropdown-selector-wrapper" @click.stop="toggleDropDown()">

      <label>
        {{ msg + (display === totalItems ? 'All' : display) }}
      </label>

      <button class="dropdown dropdown-button">

        <slot name="dropdown-icon"></slot>

      </button>

    </div>

    <div
      class="dropdown dropdown-list"
      :class="{ hidden: closed }">
      <template v-for="option in options">
        <div
          v-if="!isNaN(option)"
          :key="`div-option-${option}`"
          :value="option"
          class="dropdown dropdown-item"
          :class="{ highlighted: (display === option) }"
          @click="optionSelected(option)">
          {{ option === totalItems ? 'All' : option }}
        </div>
      </template>
    </div>

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ===================================================================== Functions
const closeAllSelect = (e, instance) => {
  const opt = document.getElementsByClassName('dropdown')
  const results = []
  for (let i = 0; i < opt.length; i++) {
    results.push(opt[i] !== e.target)
  }
  if (results.every(bool => bool)) {
    instance.closed = true
  }
}

// ====================================================================== Export
export default {
  name: 'ResultsPerPageSelector',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
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
    },
    addParamOnLoad: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
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
      const displayOptions = []
      const total = this.collection.length

      for (let i = 0; i < this.displayOptions.length; i++) {
        displayOptions.push(this.displayOptions[i])
      }
      if (total <= displayOptions[0].amount) {
        return [total]
      }
      displayOptions.push(total)
      return displayOptions
    }
  },

  mounted () {
    if (this.$route.query.results) {
      this.setDisplay(parseInt(this.$route.query.results))
    }
    if (this.addParamOnLoad && this.display) {
      this.optionSelected(this.display)
    }
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
        this.setDisplay(selection)
        this.calculateTotalPages()
        const cloned = CloneDeep(this.$route.query)
        if (this.page > this.totalPages) {
          cloned.page = this.totalPages
        }
        if (cloned.page === 1) {
          delete cloned.page
        }
        cloned.results = this.display
        this.$router.push({ query: cloned })
        this.closed = true
      }
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
  margin-left: 0.5rem;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
}

.dropdown-list {
  background-color: #ffffff;
  position: absolute;
  right: 1.0rem;
  top: 2.5rem;
  @include borderRadius3;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  padding: 0.25rem 0.75rem;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}

.highlighted {
  background-color: #6BC4CE;
  color: white;
}

</style>
