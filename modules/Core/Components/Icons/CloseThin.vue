<template>
  <svg class="svg-icon close-thin-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298.55 300.18">

    <path
      class="svg-path close-thin-svg-path"
      :fill="fill"
      d="M15.45,300.18L0,284.5,133.62,150.39,0.23,16.54,15.86,1.13l133.08,134.1L283.18,0,298.3,15.93l-133,133.52L298.55,283.32l-15.47,15.52L149.94,164.62Z" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'CloseThin',

  props: {
    fill: {
      type: String,
      default: '#292929',
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.svg-icon {
  display: block;
}
</style>
