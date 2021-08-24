<template>
  <svg class="svg-icon arrow-right-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 11.2">

    <path class="svg-path arrow-right-path" :stroke="stroke" d="M7.3,0.7l4.9,5l-4.9,4.9" />

    <path class="svg-path arrow-right-path" :stroke="stroke" d="M0,5.7h12.1" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ArrowRight',

  props: {
    stroke: {
      type: String,
      default: '#FFFFFF',
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.arrow-right-icon {
  display: block;
}

.arrow-right-path {
  fill: none;
  stroke-width: 2px;
}
</style>
