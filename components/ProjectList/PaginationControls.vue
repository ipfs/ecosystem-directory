<template>
  <div class="pagination-control-wrapper">
    <Controls
    first="«"
    prev="‹"
    next="›"
    last="»"/>
  </div>
</template>

<script>
import Controls from '@/modules/zero/pagination/Components/Controls'

export default {
  name: 'PaginationControls',

  components: {
    Controls
  }
}
</script>

<style lang="scss">

  .pagination-control-wrapper {
    font-family: $fontInter;
    font-weight: 600;
  }

</style>
