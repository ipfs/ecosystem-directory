<template>
  <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="15.374" height="9.893" viewBox="0 0 15.374 9.893">

    <g transform="translate(-1217.528 -96)">

      <path d="M4204.669,1343.281h13.374" transform="translate(-2986.141 -1246.281)" :stroke="stroke" stroke-linecap="round" stroke-width="2" />

      <path d="M4204.669,1343.281h7.433" transform="translate(-2983.056 -1242.335)" :stroke="stroke" stroke-linecap="round" stroke-width="2" />

      <path d="M4204.669,1343.281h3.26" transform="translate(-2981.022 -1238.388)" :stroke="stroke" stroke-linecap="round" stroke-width="2" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FiltersToggle',

  props: {
    stroke: {
      type: String,
      default: '#052437',
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
