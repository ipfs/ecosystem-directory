<template>
  <section id="typography">

    <section id="font-sizing">
      <div class="nested-outline">
        <h3>Font Sizing</h3>
      </div>
      <ul>
        <li
          v-for="size in sizes"
          :key="size.className"
          :class="size.className">
          <pre>{{ size.tag }}</pre>
          <p>{{ text }}</p>
        </li>
      </ul>
    </section>

  </section>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'KitchenSinkTypography',

  data () {
    return {
      sizes: [
        { className: 'font-size-mini', tag: 'fontSize_Mini' },
        { className: 'font-size-small', tag: 'fontSize_Small' },
        { className: 'font-size-regular', tag: 'fontSize_Regular' },
        { className: 'font-size-medium', tag: 'fontSize_Medium' },
        { className: 'font-size-large', tag: 'fontSize_Large' },
        { className: 'font-size-extra-large', tag: 'fontSize_ExtraLarge' },
        { className: 'font-size-extra-extra-large', tag: 'fontSize_ExtraExtraLarge' }
      ],
      text: 'The quick brown fox jumps over the lazy dog'
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
pre {
  @include fontSize_Regular;
}

p {
  font-size: inherit;
}

li {
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
}

// ///////////////////////////////////////////////////////////////// Font Sizing
.font-size-mini {
  @include fontSize_Mini;
}

.font-size-small {
  @include fontSize_Small;
}

.font-size-regular {
  @include fontSize_Regular;
}

.font-size-medium {
  @include fontSize_Medium;
}

.font-size-large {
  @include fontSize_Large;
}

.font-size-extra-large {
  @include fontSize_ExtraLarge;
}

.font-size-extra-extra-large {
  @include fontSize_ExtraExtraLarge;
}
</style>
