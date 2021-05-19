<template>
  <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="11.425" height="7.87" viewBox="0 0 11.425 7.87">

    <g transform="translate(-470.59 -380.16)">

      <path
        d="M0,0,3.475,4.1l.8.947"
        transform="translate(480.605 386.62) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

      <line
        x1="4.329"
        y2="5.05"
        transform="translate(476.328 386.62) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ToggleArrow',

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
.arrow {
  display: block;
}

</style>
