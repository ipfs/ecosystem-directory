<template>
  <svg class="svg-icon checkmark-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408.98 292.07">

    <path
      class="svg-path checkmark-svg-path"
      d="M136.82,310.08c1.55-2.2,2.35-3.77,3.53-4.95q117-117.06,234-234.09c5.76-5.77,12.24-8.55,20.3-6.37a19.26,19.26,0,0,1,10.23,30.55,50.53,50.53,0,0,1-4.31,4.67Q276.64,223.83,152.72,347.74c-11.08,11.08-21.45,11-32.62-.13Q63.54,291,7,234.51C1.48,229-1.31,222.78.6,215a19.3,19.3,0,0,1,31.21-10.47,58.65,58.65,0,0,1,4.3,4.09q48.31,48.3,96.61,96.62C133.82,306.32,134.73,307.59,136.82,310.08Z"
      transform="translate(0 -63.94)"
      :fill="fill" />

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Checkmark',

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

.svg-path {
  transition: 250ms ease-in-out;
}
</style>
