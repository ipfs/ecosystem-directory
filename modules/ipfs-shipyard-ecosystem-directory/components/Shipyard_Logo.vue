<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="146" height="60" viewBox="0 0 146 60">
    <text
      transform="translate(0 49)"
      :fill="stroke"
      font-size="50"
      font-family="HelveticaNeue-Bold, Helvetica Neue"
      font-weight="700">
      <tspan x="0" y="0">
        LOGO
      </tspan>
    </text>
  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardLogo',

  props: {
    stroke: {
      type: String,
      default: '#FFFFFF',
      required: false
    }
  }
}
</script>
