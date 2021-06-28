<template>
  <svg class="svg-dropdown dropdown" xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 8.841 5.798">

    <g
      class="dropdown"
      transform="translate(7.781 1.06) rotate(90)">

      <path
        class="dropdown"
        d="M0,0,3.679,3.36"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="1.5" />

      <path
        class="dropdown"
        d="M0,3.36,3.679,0"
        transform="translate(0 3.362)"
        :stroke="stroke"
        stroke-linecap="round"
        stroke-width="1.5" />

    </g>

  </svg>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'SelectorToggle',

  props: {
    stroke: {
      type: String,
      default: '#181818',
      required: false
    }
  }
}
</script>
