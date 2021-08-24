<template>
  <svg class="svg-icon play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396.35 457.88">

    <path class="svg-path play-icon-path" :fill="fill" d="M396.35,228.94L0,457.88V0Z" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Play',

  props: {
    fill: {
      type: String,
      default: '#1B1B1B',
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.play-icon {
  display: block;
}
</style>
