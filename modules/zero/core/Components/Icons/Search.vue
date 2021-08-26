<template>
  <svg class="svg-icon search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18.5">

    <line
      class="svg-line search-svg-line"
      :stroke="stroke"
      x1="11.51"
      y1="13.96"
      x2="13.91"
      y2="17.5" />

    <circle
      class="svg-circle search-svg-circle"
      :stroke="stroke"
      cx="7.5"
      cy="7.5"
      r="6.5" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Search',

  props: {
    stroke: {
      type: String,
      default: '#1B1B1B',
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.search-icon {
  display: block;
}

.search-svg-circle,
.search-svg-line {
  fill: none;
  stroke-linecap: round;
  stroke-width: 2px;
}
</style>
