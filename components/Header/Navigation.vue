<template>
  <section
    v-if="navigation"
    id="header-navigation"
    :class="headerNavigationClasses">

    <div class="grid-noGutter">

      <div :class="['modal-background', { 'show-background': navOpen, 'transition-out': modalClosing }]"></div>

      <div class="col">
        <div class="navigation-content">

          <a :href="navigation.index.href">
            <svg id="ipfs-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 553 235.3">
              <path d="M239 63h17.8v105H239V63zm35.6 0h36.3c7.9 0 14.5.9 19.6 2.6s9.2 4.1 12.1 7.1a24.45 24.45 0 0 1 6.2 10.2 40.75 40.75 0 0 1 1.8 12.1 45.69 45.69 0 0 1-1.8 12.9 26.58 26.58 0 0 1-6.2 10.8 30.59 30.59 0 0 1-12.1 7.3c-5.1 1.8-11.5 2.7-19.3 2.7h-19.1V168h-17.5V63zm36.2 51a38.37 38.37 0 0 0 11.1-1.3 16.3 16.3 0 0 0 6.8-3.7 13.34 13.34 0 0 0 3.5-5.8 29.75 29.75 0 0 0 1-7.6 25.68 25.68 0 0 0-1-7.7 12 12 0 0 0-3.6-5.5 17.15 17.15 0 0 0-6.9-3.4 41.58 41.58 0 0 0-10.9-1.2h-18.5V114h18.5zm119.9-51v15.3h-49.2V108h46.3v15.4h-46.3V168h-17.8V63h67zm26.2 72.9c.8 6.9 3.3 11.9 7.4 15s10.4 4.7 18.6 4.7a32.61 32.61 0 0 0 10.1-1.3 20.52 20.52 0 0 0 6.6-3.5 12 12 0 0 0 3.5-5.2 19.08 19.08 0 0 0 1-6.4 16.14 16.14 0 0 0-.7-4.9 12.87 12.87 0 0 0-2.6-4.5 16.59 16.59 0 0 0-5.1-3.6 35 35 0 0 0-8.2-2.4l-13.4-2.5a89.76 89.76 0 0 1-14.1-3.7 33.51 33.51 0 0 1-10.4-5.8 22.28 22.28 0 0 1-6.3-8.8 34.1 34.1 0 0 1-2.1-12.7 26 26 0 0 1 11.3-22.4 36.35 36.35 0 0 1 12.6-5.6 65.89 65.89 0 0 1 15.8-1.8c7.2 0 13.3.8 18.2 2.5a34.46 34.46 0 0 1 11.9 6.5 28.21 28.21 0 0 1 6.9 9.3 42.1 42.1 0 0 1 3.2 11l-16.8 2.6c-1.4-5.9-3.7-10.2-7.1-13.1s-8.7-4.3-16.1-4.3a43.9 43.9 0 0 0-10.5 1.1 19.47 19.47 0 0 0-6.8 3.1 11.63 11.63 0 0 0-3.7 4.6 14.08 14.08 0 0 0-1.1 5.4c0 4.6 1.2 8 3.7 10.3s6.9 4 13.2 5.3l14.5 2.8c11.1 2.1 19.2 5.6 24.4 10.5s7.8 12.1 7.8 21.4a31.37 31.37 0 0 1-2.4 12.3 25.27 25.27 0 0 1-7.4 9.8 36.58 36.58 0 0 1-12.4 6.6 56 56 0 0 1-17.3 2.4c-13.4 0-24-2.8-31.6-8.5s-11.9-14.4-12.6-26.2h18z" style="fill:#fff" />
              <path fill="#469ea2" d="m30.3 164 84 48.5 84-48.5V67l-84-48.5-84 48.5v97z" />
              <path d="m105.7 30.1-61 35.2a18.19 18.19 0 0 1 0 3.3l60.9 35.2a14.55 14.55 0 0 1 17.3 0l60.9-35.2a18.19 18.19 0 0 1 0-3.3L123 30.1a14.55 14.55 0 0 1-17.3 0zm84 48.2-61 35.6a14.73 14.73 0 0 1-8.6 15l.1 70a15.57 15.57 0 0 1 2.8 1.6l60.9-35.2a14.73 14.73 0 0 1 8.6-15V79.9a20 20 0 0 1-2.8-1.6zm-150.8.4a15.57 15.57 0 0 1-2.8 1.6v70.4a14.38 14.38 0 0 1 8.6 15l60.9 35.2a15.57 15.57 0 0 1 2.8-1.6v-70.4a14.38 14.38 0 0 1-8.6-15L38.9 78.7z" style="fill:#6acad1" />
              <path fill="#469ea2" d="m114.3 29 75.1 43.4v86.7l-75.1 43.4-75.1-43.4V72.3L114.3 29m0-10.3-84 48.5v97l84 48.5 84-48.5v-97l-84-48.5z" />
              <path fill="#469ea2" d="M114.9 132h-1.2A15.66 15.66 0 0 1 98 116.3v-1.2a15.66 15.66 0 0 1 15.7-15.7h1.2a15.66 15.66 0 0 1 15.7 15.7v1.2a15.66 15.66 0 0 1-15.7 15.7zm0 64.5h-1.2a15.65 15.65 0 0 0-13.7 8l14.3 8.2 14.3-8.2a15.65 15.65 0 0 0-13.7-8zm83.5-48.5h-.6a15.66 15.66 0 0 0-15.7 15.7v1.2a15.13 15.13 0 0 0 2 7.6l14.3-8.3V148zm-14.3-89a15.4 15.4 0 0 0-2 7.6v1.2a15.66 15.66 0 0 0 15.7 15.7h.6V67.2L184.1 59zm-69.8-40.3L100 26.9a15.73 15.73 0 0 0 13.7 8.1h1.2a15.65 15.65 0 0 0 13.7-8l-14.3-8.3zM44.6 58.9l-14.3 8.3v16.3h.6a15.66 15.66 0 0 0 15.7-15.7v-1.2a16.63 16.63 0 0 0-2-7.7zM30.9 148h-.6v16.2l14.3 8.3a15.4 15.4 0 0 0 2-7.6v-1.2A15.66 15.66 0 0 0 30.9 148z" />
              <path d="M114.3 213.2v-97.1l-84-48.5v97.1z" style="fill-opacity:.15;fill:#083b54" />
              <path d="M198.4 163.8v-97l-84 48.5v97.1z" style="fill-opacity:.05;fill:#083b54" />
            </svg>
          </a>

          <div :class="['navigation', { 'modal-open' : navOpen, 'transition-out': modalClosing }]">
            <div class="links-container">
              <component
                :is="link.type"
                v-for="(link, index) in navigation.header"
                :key="index"
                :to="link.disabled ? '' : link.href"
                :href="link.disabled ? '' : link.href"
                :disabled="link.disabled"
                :target="link.target"
                class="navigation-link onhover-line">
                {{ link.label }}
              </component>
            </div>
            <div :class="['social-icon-container', { 'visible': navOpen }]">
              <SocialIcons />
            </div>
          </div>

          <div :class="['hamburger-icon', {'close-icon' : navOpen}]" @click="toggleNav"></div>

        </div>
      </div>
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import SocialIcons from '@/components/SocialIcons'

// =================================================================== Functions
const checkScreenWidth = (instance) => {
  if (!window.matchMedia('(max-width: 768px)').matches && instance.navOpen) { // ← 768px requested interim solution
    instance.toggleNav()
  }
}

// ====================================================================== Export
export default {
  name: 'HeaderNavigation',

  components: {
    SocialIcons
  },

  data () {
    return {
      navOpen: false,
      resize: false,
      scroll: false,
      modalClosing: false,
      scrollPosition: 0,
      showBackground: false,
      forceNavigationVisible: true
    }
  },

  computed: {
    ...mapGetters({
      navigation: 'global/navigation',
      filterPanelOpen: 'filters/filterPanelOpen'
    }),
    headerNavigationClasses () {
      const showBackground = this.showBackground
      const forceVisible = this.forceNavigationVisible
      let compiled = ''
      if (forceVisible) { compiled += 'force-visible ' }
      if (showBackground) { compiled += 'show-background ' }
      return compiled
    }
  },

  watch: {
    scrollPosition (newVal, oldVal) {
      const showBackground = this.showBackground
      const forceVisible = this.forceNavigationVisible
      // const scrollSpeed = this.$GetScrollSpeed(newVal)
      if (newVal === 0 && showBackground) {
        this.showBackground = false
      } else if (newVal > 0 && !showBackground) {
        this.showBackground = true
      }
      // console.log(scrollSpeed)
      if (newVal === 0) {
        this.forceNavigationVisible = true
      } else if (newVal < oldVal && !forceVisible) {
        this.forceNavigationVisible = true
      } else if (newVal > 80 && newVal > oldVal && forceVisible) {
        this.forceNavigationVisible = false
      }
    }
  },

  mounted () {
    this.resize = this.$throttle(() => { checkScreenWidth(this) }, 310)
    this.scroll = () => { this.updateScrollPosition() }
    window.addEventListener('resize', this.resize)
    window.addEventListener('scroll', this.scroll)
    this.updateScrollPosition()
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    toggleNav () {
      if (this.navOpen) {
        this.modalClosing = true
        setTimeout(() => {
          this.modalClosing = false
          document.body.classList.remove('no-scroll')
          this.navOpen = !this.navOpen
        }, 300)
      } else {
        document.body.classList.add('no-scroll')
        this.navOpen = !this.navOpen
      }
    },
    updateScrollPosition () {
      this.scrollPosition = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#header-navigation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $navigationHeight;
  z-index: 9999;
  transform: translateY(-$navigationHeight);
  transition: transform 250ms ease-in-out;
  &.force-visible {
    transform: translateY(0);
  }
  &.show-background {
    &:before {
      opacity: 1;
    }
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 250ms ease-in-out;
  }
}

[class*="grid"],
[class*="col"],
.navigation-content {
  height: 100%;
}

.navigation-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#ipfs-logo,
.navigation-link {
  cursor: pointer;
}

#ipfs-logo {
  display: block;
  position: relative;
  width: 8rem;
  opacity: 1.0;
  z-index: 100;
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1.0);
  &:hover {
    opacity: 0.75;
  }
}

.navigation {
  width: 100%;
  max-width: 32rem; // ← requested interim solution
  @include customMaxMQ (768px) { // ← requested interim solution
    display: none;
    flex-direction: column;
    position: fixed;
    top: $navigationHeight;
    left: 0;
    width: 100vw;
    max-width: none;
    height: calc(100vh - 5rem);
    z-index: 100;
  }
  &.modal-open {
    display: flex;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

.links-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 2rem;
  @include customMaxMQ (768px) { // ← requested interim solution
    flex-direction: column;
    justify-content: center;
    margin-left: 5rem;
  }
}

.navigation-link {
  @include customMaxMQ (768px) { // ← requested interim solution
    align-self: start;
    margin-bottom: 0.75rem;
    font-size: 2.1875rem;
    font-weight: 500;
    line-height: 1.2;
  }
}

// ////////////////////////////////////////////////////// Modal + Hamburger icon
.modal-background {
  display: none;
  @include customMaxMQ (768px) { // ← requested interim solution
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 99;
  }
  &.show-background {
    display: inline;
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

.social-icon-container {
  display: none;
  &.visible {
    @include customMaxMQ (768px) { // ← requested interim solution
      display: inline;
      align-self: start;
      margin: 2rem 0;
      margin-left: 5rem;
    }
  }
}

.hamburger-icon {
  display: none;
  position: relative;
  z-index: 1000;
  height: 14px;
  width: 2rem;
  @include customMaxMQ (768px) { // ← requested interim solution
    display: inline;
  }
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    top: 0px;
    border-top: 2px solid white;
    transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    bottom: 2px;
    border-top: 2px solid white;
    transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
  &.close-icon {
    &:before {
      transform: rotate(45deg) translate(3px, 4px);
    }
    &:after {
      transform: rotate(-45deg) translate(3px, -4px);
    }
  }
  &:hover {
    cursor: pointer;
  }
}

// ////////////////////////////////////////////////////////////////// Animations
@keyframes landing {
  from {
    transform: scale(1.1);
    opacity: 0.0;
  }
  to {
    transform: scale(1.0);
    opacity: 1.0;
  }
}

.transition-out {
  transition: 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  transform: scale(1.1);
  opacity: 0.0;
}
</style>
