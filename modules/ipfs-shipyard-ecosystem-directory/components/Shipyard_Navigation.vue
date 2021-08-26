<template>
  <section
    v-if="navigation"
    id="header-navigation"
    :class="headerNavigationClasses">

    <div class="grid-noGutter">

      <div :class="['modal-background', { 'show-background': navOpen, 'transition-out': modalClosing }]"></div>

      <div class="col">
        <div class="navigation-content">

          <a :href="navigation.index.href" tabindex="0" class="logo-link focus-visible">
            <Shipyard_Logo />
          </a>

          <div
            :class="['hamburger-icon', 'focus-visible', {'close-icon' : navOpen}]"
            tabindex="0"
            @click="toggleNav"
            @keyup.enter="toggleNav">
          </div>

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
                class="navigation-link onhover-line focus-visible">
                {{ link.label }}
              </component>
            </div>
            <div :class="['social-icon-container', { 'visible': navOpen }]">
              <Shipyard_SocialIcons />
            </div>
          </div>

        </div>
      </div>
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// =================================================================== Functions
const checkScreenWidth = (instance) => {
  if (!window.matchMedia('(max-width: 768px)').matches && instance.navOpen) { // ← 768px requested interim solution
    instance.toggleNav()
  }
}

// ====================================================================== Export
export default {
  name: 'ShipyardNavigation',

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

.logo-link {
  @include borderRadius_Medium;
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
  @include borderRadius_Medium;
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
