<template>
  <component :is="rootNode">

    <div class="dropdown dropdown-selector-wrapper" @click.stop="toggleDropDown()">

      <label>
        {{ msg + selected }}
      </label>

      <button class="dropdown dropdown-button">

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
// import { mapGetters, mapActions } from 'vuex'

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
      selected: ''
    }
  },

  computed: {
    options () {
      return this.displayOptions
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
    toggleDropDown () {
      this.closed = !this.closed
    },
    optionSelected (val) {
      this.selected = val
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
  margin-left: 0.5rem;
  &:hover {
    cursor: pointer;
    opacity: 1.0;
  }
}

.dropdown-list {
  background-color: #ffffff;
  position: absolute;
  right: 0.5rem;
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
