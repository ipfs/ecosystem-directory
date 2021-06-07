<template>
  <div class="dropdown-wrapper">
    <div class="dropdown-root">

      <div class="dropdown-button" @click.stop="toggleDropDown()">

        <label>
          {{ msg }}
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
        v-if="displayOptions"
        v-click-outside="closeAllSelect"
        :class="['dropdown-list', { hidden: closed }]">

        <div class="dropdown-button" @click.stop="toggleDropDown()">

          <label>
            {{ msg }}
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
    msg: {
      type: String,
      required: false,
      default: 'Sort by: '
    },
    sortOptions: {
      type: Object,
      required: true
    },
    displayOptions: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      closed: true,
      unfocus: false,
      selected: 'A-Z'
    }
  },

  computed: {
    ...mapGetters({
      collection: 'filters/collection'
    }),
    options () {
      const displayOptions = []
      Object.keys(this.sortOptions).forEach((key) => {
        displayOptions.push(this.sortOptions[key])
      })
      return displayOptions
    }
  },

  mounted () {
    this.sortAlphabetically('name', this.selected)
  },

  methods: {
    ...mapActions({
      setCollection: 'filters/setCollection'
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

      if (obj.type === "alphabetical") {
        this.sortAlphabetically(obj.key, obj.label)
      } else if (obj.type === "number") {
        this.sortNumerically(obj.sortNumber, obj.direction)
        console.log('hit')
      }
    },
    sortAlphabetically (key, mode) {
      const cloned = CloneDeep(this.collection)
      cloned.sort((a, b) => a[key].localeCompare(b[key]))
      if (mode === "Z-A") {
        cloned.reverse()
      }
      this.setCollection(cloned)
    },
    sortNumerically(key, mode) {
      const cloned = CloneDeep(this.collection)

      console.log(cloned[0].sortNumbers.since)
      cloned.sort((a, b) => a.sortNumbers[key] - b.sortNumbers[key])
      if (mode === "DESC") {
        cloned.reverse()
      }
      this.setCollection(cloned)
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
  min-width: 190px;
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
    margin-right: 0.2rem;
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
  ::before {
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
  // overflow-wrap: anywhere;
  white-space: normal;
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
