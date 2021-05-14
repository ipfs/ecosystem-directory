<template>
  <div class="pagination-control-wrapper">
    <Controls
      first="«"
      prev="‹"
      next="›"
      last="»"
      class="pagination-font" />
  </div>
</template>

<script>
// ===================================================================== Imports
import Controls from '@/modules/zero/pagination/Components/Controls'

// ====================================================================== Export
export default {
  name: 'PaginationControls',

  components: {
    Controls
  }
}
</script>

<style lang="scss">

  .pagination-font,
  .pagination-control-wrapper {
    font-family: $fontInter;
    font-weight: 600;
  }

</style>
