<template>
  <div :class="['filter-bar', { focused }]">

    <div class="icon-container">
      <IconSearch />
    </div>

    <input
      :value="filterValue"
      :placeholder="placeholder"
      type="text"
      class="input"
      @input="handleInput"
      @focus="focused = true"
      @blur="focused = false">

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

import IconSearch from '@/components/Icons/Search'

// ====================================================================== Export
export default {
  name: 'FilterBar',

  components: {
    IconSearch
  },

  props: {
    filterValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Enter text here'
    },
    action: {
      type: String,
      required: false,
      default: 'emit'
    }
  },

  data () {
    return {
      focused: false
    }
  },

  created () {
    this.setFilterValue('')
  },

  methods: {
    ...mapActions({
      setFilterValue: 'core/setFilterValue'
    }),
    handleInput (e) {
      const action = this.action
      const value = e.target.value
      if (action === 'emit') {
        this.$emit('setFilterValue', value)
      } else if (action === 'store') {
        this.setFilterValue(value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$dimensions: 2.75rem;

// ///////////////////////////////////////////////////////////////////// General
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  width: 20rem;
  height: calc(#{$dimensions} - 2px);
  margin-right: 1rem;
  @include mini {
    width: auto;
    max-width: 20rem;
  }
  @include tiny {
    max-width: none;
  }
  .input {
    padding: 0.66rem;
    background-color: white;
    -webkit-appearance: none
  }
  &.focused {
    .icon-container,
    .input {
      transition: 250ms ease-in;
    }
    ::v-deep .icon-container {
      background-color: blue;
      .search-svg-circle,
      .search-svg-line {
        transition: 250ms ease-in;
        stroke: white;
      }
    }
    .input {
      border-color: blue;
      padding: 0.66rem 0.75rem;
    }
  }
}

.icon-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(#{$dimensions} - 2px);
  height: calc(#{$dimensions} - 2px);
  background-color: white;
  border-radius: 0.125rem 0 0 0.125rem;
  transition: 250ms ease-out;
  ::v-deep .search-icon {
    width: 1rem;
    .search-svg-circle,
    .search-svg-line {
      transition: 250ms ease-out;
    }
  }
}

.input {
  @include font14;
  width: calc(100% - (#{$dimensions} - 2px));
  height: 100%;
  padding: 0;
  font-weight: 500;
  border: 2px solid white;
  background-color: white;
  border-radius: 0 0.125rem 0.125rem 0;
  transition: 250ms ease-out;
  &:hover {
    transition: 250ms ease-in;
    background-color: white;
  }
}
</style>
