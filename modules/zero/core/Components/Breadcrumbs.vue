<template>
  <section class="breadcrumbs">

    <component
      :is="link.type"
      v-for="(link, index) in breadcrumbs"
      :key="index"
      :to="link.disabled ? '' : { path: link.href, query: link.query || false }"
      :href="link.disabled ? '' : link.href + $CompileQueryString(link.query)"
      :disabled="link.disabled"
      :target="link.target"
      :class="link.type === 'div' ? 'breadcrumb-button' : 'breadcrumb-link'">
      {{ link.label }}
    </component>

  </section>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'Breadcrumbs',

  props: {
    breadcrumbs: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.breadcrumbs {
  @include fontSize_Small;
}

.breadcrumb-link,
.breadcrumb-button {
  display: inline-block;
  font-size: inherit;
  font-weight: 600;
  &:not(:last-child) {
    &:after {
      content: '/';
      margin-left: 0.25rem;
      margin-right: 0.5rem;
    }
  }
}

.breadcrumb-link {
  color: $paradiso;
}
</style>
