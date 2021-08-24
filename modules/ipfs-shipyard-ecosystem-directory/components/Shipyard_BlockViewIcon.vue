<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">

    <g fill="none" :stroke="stroke" stroke-linejoin="round" stroke-width="1">
      <rect width="5" height="5" stroke="none" fill="none" />
      <rect x="0.5" y="0.5" width="4" height="4" fill="none" />
    </g>

    <g transform="translate(0 6)" fill="none" :stroke="stroke" stroke-linejoin="round" stroke-width="1">
      <rect width="5" height="5" stroke="none" fill="none" />
      <rect x="0.5" y="0.5" width="4" height="4" fill="none" />
    </g>

    <g transform="translate(6)" fill="none" :stroke="stroke" stroke-linejoin="round" stroke-width="1">
      <rect width="5" height="5" stroke="none" fill="none" />
      <rect x="0.5" y="0.5" width="4" height="4" fill="none" />
    </g>

    <g transform="translate(6 6)" fill="none" :stroke="stroke" stroke-linejoin="round" stroke-width="1">
      <rect width="5" height="5" stroke="none" fill="none" />
      <rect x="0.5" y="0.5" width="4" height="4" fill="none" />
    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardBlockViewIcon',

  props: {
    stroke: {
      type: String,
      default: '#181818',
      required: false
    }
  }
}
</script>
