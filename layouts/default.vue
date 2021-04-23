<template>
  <div class="master-container">

    <Toaster />

    <nuxt />

  </div>
</template>

<script>
// ===================================================================== Imports
import Toaster from '@/modules/Core/Components/Toaster'

// ====================================================================== Export
export default {
  components: {
    Toaster
  }
}
</script>

<style lang="scss" scoped>
</style>
