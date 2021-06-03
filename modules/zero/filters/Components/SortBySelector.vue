<template>
  <component :is="rootNode">

    <div class="dropdown-button" @click.stop="toggleDropDown()">

      <label>
        {{ msg + selected }}
      </label>

      <button class="dropdown dropdown-toggle">

        <slot name="dropdown-icon"></slot>

      </button>

    </div>

    <div
      v-if="displayOptions"
      class="dropdown dropdown-list"
      :class="{ hidden: closed }">
      <template v-for="option in options">
        <div
          :key="`div-option-${option}`"
          :value="option"
          class="dropdown dropdown-item"
          :class="{ highlighted: (selected === option) }"
          @click="optionSelected(option)">
          {{ option }}
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
  name: 'SortBySelector',

  props: {
    rootNode: {
      type: String,
      required: false,
      default: 'div'
    },
    msg: {
      type: String,
      required: false,
      default: 'Sort by: '
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
      selected: 'none'
    }
  },

  computed: {
    ...mapGetters({
      collection: 'filters/collection'
    }),
    options () {
      const displayOptions = []
      for (let i = 0; i < this.displayOptions.length; i++) {
        displayOptions.push(this.displayOptions[i])
      }
      displayOptions.push('none')
      return displayOptions
    }
  },

  watch: {
    selected (val) {
      if (val === 'A-Z') {
        this.sortAlphabetically()
      }
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
      setCollection: 'filters/setCollection'
    }),
    toggleDropDown () {
      this.closed = !this.closed
    },
    optionSelected (val) {
      this.selected = val
      this.closed = true
    },
    sortAlphabetically () {
      const cloned = CloneDeep(this.collection)
      cloned.sort((a, b) => a.name.localeCompare(b.name))
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
  visibility: hidden;
}

.dropdown-button {
  padding: 0.25rem 1.0rem;
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
  position: relative;
  width: 100%;
  top: -2px;
  overflow: hidden;
  text-align: right;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 0 0 0.3125rem 0.3125rem;
  z-index: 1000;
}

.dropdown-item {
  padding: 0.25rem 1.0rem;
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
