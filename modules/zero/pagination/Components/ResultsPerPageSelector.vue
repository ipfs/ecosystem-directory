<template>
  <component
    :is="rootNode"
    id="results-per-page-selector"
    v-click-outside="closeAllSelect"
    :class="['dropdown-root', 'focus-visible', { closed }]"
    @keyup.enter="toggleDropdown()">

    <div class="dropdown dropdown-button" @click.stop="toggleDropdown()">

      <label>
        {{ label + (display === totalItems ? 'All' : display) }}
      </label>

      <div class="dropdown dropdown-slot">

        <slot name="dropdown-icon"></slot>

      </div>

    </div>

    <div class="dropdown dropdown-list">
      <template v-for="option in options">
        <div
          v-if="!isNaN(option)"
          :key="`div-option-${option}`"
          :value="option"
          :tabindex="closed ? -1 : 0"
          class="dropdown dropdown-item focus-visible"
          :class="{ highlighted: (display === option) }"
          @click="optionSelected(option)"
          @keyup.enter="optionSelected(option)">
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
      default: 'button'
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
      routeQuery: 'filters/routeQuery',
      totalPages: 'filters/totalPages'
    }),
    display () {
      return this.routeQuery.results
    },
    page () {
      return this.routeQuery.page ? this.routeQuery.page : 1
    },
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
    if (this.addParamOnLoad && this.display) {
      this.optionSelected(this.display)
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setTotalPages: 'filters/setTotalPages'
    }),
    calculateTotalPages () {
      const total = Math.ceil(this.collection.length / this.display)
      this.setTotalPages(total)
    },
    toggleDropdown () {
      this.closed = !this.closed
      this.$emit('changed', {
        event: 'toggleDropdown',
        data: {
          state: !this.closed ? 'open' : 'closed'
        }
      })
    },
    closeAllSelect () {
      if (!this.closed) {
        this.$emit('changed', {
          event: 'toggleDropdown',
          data: {
            state: 'closed'
          }
        })
      }
      this.closed = true
    },
    optionSelected (val) {
      const selection = parseInt(val)
      if (!isNaN(selection)) {
        this.setRouteQuery({
          key: 'results',
          data: selection
        })
        this.calculateTotalPages()
        const total = this.totalPages
        if (this.page > total) {
          this.setRouteQuery({
            key: 'page',
            data: total
          })
        }
        this.$emit('changed', {
          event: 'optionSelected',
          data: {
            option: selection
          }
        })
        this.toggleDropdown()
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

.dropdown-root {
  @include borderRadius_Medium;
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 400;
  line-height: 1.7;
  &:not(.closed) {
    .dropdown-list {
      transition: 250ms ease-out;
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
      z-index: 1000;
      pointer-events: all;
    }
    .dropdown-slot {
      transition: 250ms ease-in;
      transform: rotate(-180deg);
    }
  }
}

.dropdown-button {
  padding: 0.25rem 1.0rem;
  display: flex;
  justify-content: space-between;
  label {
    cursor: pointer;
    margin-right: 0.25rem;
  }
}

.dropdown-slot {
  transform: translateY(-5%);
  opacity: 0.5;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: 250ms ease-out;
  &:hover {
    opacity: 1.0;
  }
}

.dropdown-list {
  @include borderRadius_Medium;
  position: absolute;
  right: 1.0rem;
  top: 2.5rem;
  transform: translateY(1rem);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
  transition: 250ms ease-out;
  &:after {
    @include borderRadius_Medium;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
    z-index: -1;
  }
}

.dropdown-item {
  padding: 0.25rem 0.75rem;
  z-index: 10;
  &:first-child {
    border-radius: 0.25rem 0.25rem 0 0;
  }
  &:last-child {
    border-radius: 0 0 0.25rem 0.25rem;
  }
  &:not(.highlighted) {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

.highlighted {
  cursor: default;
}
</style>
