<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="13.617" height="9.352" viewBox="0 0 13.617 9.352">

    <line x2="9.117" transform="translate(3.75 0.75)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

    <line x2="0.334" transform="translate(0.75 0.75)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

    <line x2="9.117" transform="translate(3.75 4.676)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

    <line x2="0.334" transform="translate(0.75 4.676)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

    <line x2="9.117" transform="translate(3.75 8.602)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

    <line x2="0.334" transform="translate(0.75 8.602)" :stroke="stroke" stroke-linecap="round" stroke-width="1.5" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'ShipyardListViewIcon',

  props: {
    stroke: {
      type: String,
      default: '#181818',
      required: false
    }
  }
}
</script>
