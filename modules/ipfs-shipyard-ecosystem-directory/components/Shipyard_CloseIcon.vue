<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="10.828" height="10.828" viewBox="0 0 10.828 10.828">

    <g transform="translate(-562.194 -62.685)">

      <path
        d="M0,0,6.389,6.5,7.863,8"
        transform="translate(571.608 72.1) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

      <path
        d="M7.875,0,0,8"
        transform="translate(571.483 72.1) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardCloseIcon',

  props: {
    stroke: {
      type: String,
      default: '#181818',
      required: false
    }
  }
}
</script>
