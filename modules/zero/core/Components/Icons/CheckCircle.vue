<template>
  <svg class="svg-icon check-circle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">

    <circle
      class="svg-circle check-circle-svg-circle"
      :stroke="stroke"
      cx="16"
      cy="16"
      r="15" />

    <path
      class="svg-path check-circle-svg-path"
      :stroke="stroke"
      d="M8.62,16.49l4.69,4.69,9.05-9.05" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'CheckCircle',

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
.check-circle-icon {
  display: block;
}

.check-circle-svg-circle,
.check-circle-svg-path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
}
</style>
