<template>
  <div class="spinner-atom">

    <div class="spinner-inner">

      <div class="spinner-line"></div>

      <div class="spinner-line"></div>

      <div class="spinner-line"></div>

      <div class="spinner-circle">
        &#9679;
      </div>

    </div>

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'AtomSpinner'
}
</script>

<style lang="scss" scoped>
$dimension: 3rem;
$colour: #0D90FF;

@keyframes spinner-atom-animation-1 {
  100% { transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg); }
}

@keyframes spinner-atom-animation-2 {
  100% { transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg); }
}

@keyframes spinner-atom-animation-3 {
  100% { transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg); }
}

// ///////////////////////////////////////////////////////////////////// General
.spinner-atom {
  height: $dimension;
  width: $dimension;
  margin: 0 auto;
  overflow: hidden;
}

.spinner-inner {
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
}

.spinner-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation-duration: 1s;
  border-left-width: calc(#{$dimension} / 25);
  border-top-width: calc(#{$dimension} / 25);
  border-left-color: $colour;
  border-left-style: solid;
  border-top-style: solid;
  border-top-color: transparent;
  &:first-child {
    animation: spinner-atom-animation-1 1s linear infinite;
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
  }
  &:nth-child(2) {
    animation: spinner-atom-animation-2 1s linear infinite;
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
  }
  &:nth-child(3) {
    animation: spinner-atom-animation-3 1s linear infinite;
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
  }
}

.spinner-circle {
  display: block;
  position: absolute;
  color: $colour;
  font-size: calc(#{$dimension} * 0.24);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
