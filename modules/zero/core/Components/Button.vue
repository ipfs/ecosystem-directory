<template>
  <component
    :is="tag"
    :to="tag === 'nuxt-link' ? to : false"
    :class="['button', `type-${type}`]"
    :disabled="disabled"
    @click="clickHandler">

    <LoaderTripleDot :class="{ show: loading }" />

    <div :class="['button-content', { hide: loading }]">
      {{ text }}
      <slot />
    </div>

  </component>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import LoaderTripleDot from '@/components/Spinners/TripleDot'

// ====================================================================== Export
export default {
  name: 'Button',

  components: {
    LoaderTripleDot
  },

  props: {
    type: { // A, B, C, D
      type: String,
      required: false,
      default: 'A'
    },
    tag: { // button or nuxt-link
      type: String,
      required: false,
      default: 'button'
    },
    to: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    loader: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    text: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    ...mapGetters({
      loaders: 'core/loaders'
    }),
    loading () {
      return this.loaders.find(obj => obj === this.loader)
    }
  },

  methods: {
    ...mapActions({
      addLoader: 'core/addLoader'
    }),
    clickHandler () {
      const loader = this.loader
      if (typeof loader === 'string') {
        this.addLoader(loader)
      }
      this.$emit('clicked')
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.button {
  position: relative;
  height: 2.5rem;
  cursor: pointer;
}

.triple-dot-loader,
.button-content {
  width: 100%;
  height: 100%;
}

.triple-dot-loader {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  &.show {
    opacity: 1;
  }
}

.button-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  &.hide {
    opacity: 0;
  }
}

// /////////////////////////////////////////////////////////////// [Type] Common
.type-A,
.type-B,
.type-C,
.type-D {
  border-radius: 0.125rem;
  white-space: nowrap;
  padding: 0 0.75rem;
  &:not(:disabled) {
    &:hover {
      transform: scale(1.05);
    }
    &:focus {
      @include focusBoxShadow;
    }
    &:active {
      transform: scale(0.95);
    }
  }
  &:disabled {
    background-color: $gray300;
    cursor: no-drop;
  }
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-A {
  @include shadow6;
  background-color: $dodgerBlue;
  &:disabled {
    box-shadow: none;
  }
}

// //////////////////////////////////////////////////////////////////// [Type] B
.type-B {
  color: $dodgerBlue;
  border: 2px solid $dodgerBlue;
  &:not(:disabled) {
    &:hover {
      text-decoration: underline;
    }
  }
  &:disabled {
    border-color: $gray300;
    color: white;
  }
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-C {
  background-color: $dodgerBlue;
}

// //////////////////////////////////////////////////////////////////// [Type] A
.type-D {
  color: $dodgerBlue;
  border: 1px solid $dodgerBlue;
  padding: 0 0.375rem;
  height: auto;
}
</style>
