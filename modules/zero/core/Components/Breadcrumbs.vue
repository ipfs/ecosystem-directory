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
      :class="[link.type === 'div' ? 'breadcrumb-button' : 'breadcrumb-link', 'focus-visible']">
      <span class="label">{{ link.label }}</span>
      <span class="divider">|</span>
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
.breadcrumb-link,
.breadcrumb-button {
  display: inline-block;
  font-size: inherit;
  &:last-child {
    .divider {
      display: none;
    }
  }
}

.breadcrumb-link {
  display: inline-flex;
  .label {
    text-decoration: underline transparent;
    text-underline-offset: $underlineSpacing;
    transition: text-decoration-color 250ms ease-out;
    &:hover {
      transition: text-decoration-color 250ms ease-in;
      text-decoration-color: currentColor;
    }
  }
}

.divider {
  margin: 0 0.5rem;
  color: inherit;
}
</style>
