<template>
  <div class="pagination-control-wrapper">
    <Controls class="pagination-font">

      <template #first-page>
        <FirstArrow stroke="#494949" />
      </template>

      <template #prev-page>
        <PrevArrow stroke="#494949" />
      </template>

      <template #next-page>
        <NextArrow stroke="#494949" />
      </template>

      <template #last-page>
        <LastArrow stroke="#494949" />
      </template>

    </Controls>
  </div>
</template>

<script>
// ===================================================================== Imports
import Controls from '@/modules/zero/pagination/Components/Controls'
import FirstArrow from '@/components/Icons/FirstArrow'
import PrevArrow from '@/components/Icons/PrevArrow'
import NextArrow from '@/components/Icons/NextArrow'
import LastArrow from '@/components/Icons/LastArrow'

// ====================================================================== Export
export default {
  name: 'PaginationControls',

  components: {
    Controls,
    FirstArrow,
    PrevArrow,
    NextArrow,
    LastArrow
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
