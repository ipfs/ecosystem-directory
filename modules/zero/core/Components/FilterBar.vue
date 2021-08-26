<template>
  <div :class="['filter-bar', { focused }]">

    <div class="icon-container">
      <slot name="icon" />
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

// ====================================================================== Export
export default {
  name: 'FilterBar',

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
$dimensions: 2.25rem;

// ///////////////////////////////////////////////////////////////////// General
.filter-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  width: 100%;
  height: calc(#{$dimensions} - 2px);
  margin-right: 1rem;
}

.icon-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: calc(#{$dimensions} - 2px);
  height: calc(#{$dimensions} - 2px);
  transition: 250ms ease-out;
}

.input {
  @include borderRadius_Medium;
  flex: 1;
  height: 100%;
  padding: 0.66rem 0;
  font-size: 10pt;
  font-weight: 300;
  transition: 250ms ease-out;
  -webkit-appearance: none;
  &:hover, &:active, &:focus {
    transition: 250ms ease-in;
  }
}
</style>
