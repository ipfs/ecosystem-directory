<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="15.103" height="11.336" viewBox="0 0 15.103 11.336">

    <g transform="translate(8.695 9.926) rotate(-90)">

      <path
        d="M0,0,3.439,4.061,4.233,5"
        transform="translate(8.517 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

      <line
        x1="4.284"
        y2="4.998"
        transform="translate(4.284 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

    </g>

    <g transform="translate(1.41 9.926) rotate(-90)">

      <path
        d="M0,0,3.439,4.061,4.233,5"
        transform="translate(8.517 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

      <line
        x1="4.284"
        y2="4.998"
        transform="translate(4.284 4.998) rotate(180)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="2" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FirstArrow',

  props: {
    stroke: {
      type: String,
      default: '#FFFFFF',
      required: false
    }
  }
}
</script>
