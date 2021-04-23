<template>
  <button
    :class="['copy-text-button', { copied: inClipboard(text) }]"
    :data-copied="labelCopied"
    :data-not-copied="labelNotCopied"
    @click="setClipboard(text)">
  </button>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ButtonCopyText',

  props: {
    text: {
      type: String,
      required: true
    },
    labelCopied: {
      type: String,
      required: false,
      default: 'Copied'
    },
    labelNotCopied: {
      type: String,
      required: false,
      default: 'Copy'
    }
  },

  computed: {
    ...mapGetters({
      clipboard: 'core/clipboard'
    })
  },

  methods: {
    ...mapActions({
      setClipboard: 'core/setClipboard'
    }),
    inClipboard (text) {
      return text === this.clipboard
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.copy-text-button {
  @include font12;
  line-height: 1;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  border-radius: 0.125rem;
  background-color: $mineShaft;
  padding: 0.375rem 0.375rem 0.3125rem 0.375rem;
  margin-left: 0.75rem;
  white-space: nowrap;
  transition: 250ms ease-out;
  &:hover {
    transition: 250ms ease-in;
    background-color: white;
    color: $mineShaft;
  }
  &.copied {
    background-color: green;
    color: white;
    &:after {
      content: attr(data-copied);
    }
  }
  &:not(.copied) {
    &:after {
      content: attr(data-not-copied);
    }
  }
}
</style>
