<template>
  <component
    :is="rootNode"
    v-click-outside="closeAllSelect"
    class="dropdown-root">

    <div class="dropdown dropdown-button" @click.stop="toggleDropDown()">

      <label>
        {{ label + (display === totalItems ? 'All' : display) }}
      </label>

      <button class="dropdown dropdown-slot">

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

// ====================================================================== Export
export default {
  name: 'ResultsPerPageSelector',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    label: {
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
      closed: true
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
      const displayOptions = CloneDeep(this.displayOptions)
      const total = this.collection.length
      if (total <= displayOptions[0].amount) {
        return [total]
      }
      if (!displayOptions.includes(total)) {
        displayOptions.push(total)
      }
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
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'global/setRouteQuery',
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
    closeAllSelect () {
      this.closed = true
    },
    optionSelected (val) {
      const selection = parseInt(val)
      if (!isNaN(selection)) {
        this.setDisplay(selection)
        this.calculateTotalPages()
        const total = this.totalPages
        const display = this.display
        if (this.page > total) {
          this.setRouteQuery({
            key: 'page',
            data: total
          })
        }
        this.setRouteQuery({
          key: 'results',
          data: display
        })
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

.dropdown-root {
  position: relative;
  white-space: nowrap;
  @include borderRadius3;
  background-color: #FFFFFF;
  cursor: pointer;
  font-family: $fontInter;
  font-weight: 400;
  line-height: 1.7;
}

.dropdown-button {
  padding: 0.25rem 1.0rem;
  display: flex;
  justify-content: space-between;
  label {
    margin-right: 0.25rem;
  }
}

.dropdown-slot {
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
  padding: 0.25rem 0;
  z-index: 1000;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #FFFFFF;
    z-index: -1;
    @include borderRadius3;
    filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
  }
}

.dropdown-item {
  padding: 0.25rem 0.75rem;
  z-index: 10;
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
