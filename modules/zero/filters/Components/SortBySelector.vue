<template>
  <div class="dropdown-wrapper">
    <div
      class="dropdown-root"
      :style="`min-width: ${maxLength * 10}px`">

      <div class="dropdown-button" @click.stop="toggleDropDown()">

        <label>
          {{ label }}
        </label>

        <div>
          <span>
            {{ selected }}
          </span>

          <button class="dropdown-toggle">
            <slot name="dropdown-icon"></slot>
          </button>
        </div>

      </div>

      <div
        v-if="sortOptions"
        v-click-outside="closeAllSelect"
        :class="['dropdown-list', { hidden: closed }]">

        <div class="dropdown-button" @click.stop="toggleDropDown()">

          <label>
            {{ label }}
          </label>

          <div>
            <span>
              {{ selected }}
            </span>

            <button class="dropdown-toggle">
              <slot name="dropdown-icon"></slot>
            </button>
          </div>
        </div>

        <template v-for="option in options">
          <div
            :key="`div-option-${option.label}`"
            :value="option.label"
            class="dropdown-item"
            :class="{ highlighted: (selected === option.label) }"
            @click="optionSelected(option)">
            {{ option.label }}
          </div>
        </template>

      </div>

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'SortBySelector',

  props: {
    label: {
      type: String,
      required: false,
      default: 'Sort by: '
    },
    sortOptions: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      closed: true,
      selected: 'Alphabetical (A-Z)'
    }
  },

  computed: {
    ...mapGetters({
      // collection: 'core/collection',
      collection: 'core/collection'
    }),
    options () {
      const displayOptions = []
      Object.keys(this.sortOptions).forEach((key) => {
        displayOptions.push(this.sortOptions[key])
      })
      return displayOptions
    },
    maxLength () {
      const chars = []
      Object.keys(this.sortOptions).forEach((key) => {
        chars.push(this.sortOptions[key].label.split('').length)
      })
      return Math.max(...chars)
    }
  },

  watch: {
    collection: {
      deep: true,
      handler (col) {
        if (col.mutation !== 'sorted') {
          this.options.forEach((item) => {
            if (item.label === this.selected) {
              if (item.type === 'alphabetical') {
                this.sortAlphabetically(item.key, item.direction)
              } else if (item.type === 'number') {
                this.sortNumerically(item.sortNumber, item.direction)
              }
            }
          })
        }
      }
    }
  },

  mounted () {
    if (this.$route.query['sort-by']) {
      Object.keys(this.sortOptions).forEach((option) => {
        if (this.sortOptions[option].slug === this.$route.query['sort-by']) {
          this.optionSelected(this.sortOptions[option])
        }
      })
    } else {
      this.sortAlphabetically('name', 'DESC')
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setCollection: 'core/setCollection'
    }),
    toggleDropDown () {
      this.closed = !this.closed
    },
    closeAllSelect () {
      this.closed = true
    },
    optionSelected (obj) {
      this.selected = obj.label
      this.closed = true
      if (obj.type === 'alphabetical') {
        this.sortAlphabetically(obj.key, obj.direction)
      } else if (obj.type === 'number') {
        this.sortNumerically(obj.sortNumber, obj.direction)
      }
      this.setRouteQuery({
        key: 'sort-by',
        data: obj.slug
      })
    },
    sortAlphabetically (key, mode) {
      if (this.collection.array) {
        const cloned = CloneDeep(this.collection.array)
        if (mode === 'ASC') {
          cloned.sort((a, b) => b[key].localeCompare(a[key]))
        } else if (mode === 'DESC') {
          cloned.sort((a, b) => a[key].localeCompare(b[key]))
        }
        const payload = { type: 'sorted', collection: cloned }
        this.setCollection(payload)
      }
    },
    sortNumerically (key, mode) {
      if (this.collection.array) {
        const cloned = CloneDeep(this.collection.array)
        if (mode === 'ASC') {
          cloned.sort((a, b) => a.sortNumbers[key] - b.sortNumbers[key])
        } else if (mode === 'DESC') {
          cloned.sort((a, b) => b.sortNumbers[key] - a.sortNumbers[key])
        }
        const payload = { type: 'sorted', collection: cloned }
        this.setCollection(payload)
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

.dropdown-toggle {
  transform: translateY(-5%);
  opacity: 0.5;
  margin-left: 0.5rem;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
}

.dropdown-list {
  position: absolute;
  width: 100%;
  top: 0;
  text-align: right;
  box-sizing: border-box;
  background-color: #ffffff;
  @include borderRadius3;
  z-index: 1000;
  padding-bottom: 0.25rem;
  &::before {
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
  padding: 0.25rem 1.0rem;
  width: 100%;
  white-space: normal;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: $underlineSpacing;
  }
}

.highlighted {
  background-color: #6BC4CE;
  color: white;
}

</style>
