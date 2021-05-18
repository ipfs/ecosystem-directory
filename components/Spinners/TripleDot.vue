<template>
  <div :class="['triple-dot-loader', `theme-${theme}`]">

    <div class="dot dot-1"></div>

    <div class="dot dot-2"></div>

    <div class="dot dot-3"></div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'TripleDotLoader',

  props: {
    theme: {
      type: String, // 'light' or 'dark'
      required: false,
      default: 'light'
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes dot {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

// ///////////////////////////////////////////////////////////////////// General
.triple-dot-loader {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &.theme-light {
    .dot {
      background-color: white;
    }
  }
  &.theme-dark {
    .dot {
      background-color: gray;
    }
  }
}

.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 100%;
  display: inline-block;
  animation: dot 1.4s infinite ease-in-out both;
  &.dot-1 {
    animation-delay: -0.32s;
  }
  &.dot-2 {
    animation-delay: -0.16s;
    margin: 0 0.25rem;
  }
}
</style>
