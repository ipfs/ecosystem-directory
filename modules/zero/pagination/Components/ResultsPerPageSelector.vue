<template>
  <div>
    <label>{{ msg }}</label>
    <select v-model="selected" class="results-per-page-selector">
      <template v-for="(option, index) in options">
        <option
          v-if="!isNaN(option)"
          :key="`option-${index}`"
          :value="{option}">
          {{ (option === totalItems ? 'All' : option) }}
        </option>
      </template>
    </select>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ResultsPerPageSelector',

  props: {
    msg: {
      type: String,
      required: false,
      default: 'Results per page:'
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
      selected: this.display
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

  watch: {
    selected (val) {
      const selection = parseInt(val.option)
      const amount = selection < 0 ? this.totalItems : selection
      this.setDisplay(amount)
      this.calculateTotalPages()
      if (this.page > this.totalPages) {
        this.$router.push({
          query: { page: this.totalPages }
        })
      }
    }
  },

  methods: {
    ...mapActions({
      setDisplay: 'pagination/setDisplay',
      setTotalPages: 'pagination/setTotalPages'
    }),
    calculateTotalPages () {
      const total = Math.ceil(this.collection.length / this.display)
      this.setTotalPages(total)
    }
  }
}
</script>

<style lang="scss" scoped>

  select {
    border: none;
  }
  
</style>
