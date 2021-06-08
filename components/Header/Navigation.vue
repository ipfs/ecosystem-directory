<template>
  <section
    v-if="navigation"
    id="header-navigation"
    :class="{ 'modal-background': navOpen }">

    <div class="grid-noGutter">
      <div class="col">
        <div class="navigation-content">

          <a :href="navigation.index.href">
            <img
              class="logo"
              :src="$relativity('/images/logo-horizontal.png')" />
          </a>

          <nav id="navigation">
            <component
              :is="link.type"
              v-for="(link, index) in navigation.header"
              :key="index"
              :to="link.disabled ? '' : link.href"
              :href="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="navigation-link">
              {{ link.label }}
            </component>
          </nav>

          <div class="nav-toggle" @click="toggleNav">
            <svg
              id="topline"
              ref="topline"
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="15"
              viewBox="0 0 38 15">
              <line
                x2="37.589"
                transform="translate(0 1.5)"
                stroke="#f1f3f2"
                stroke-width="3" />
            </svg>

            <svg
              id="bottomline"
              ref="bottomline"
              xmlns="http://www.w3.org/2000/svg"
              width="38"
              height="15"
              viewBox="0 0 38 15">
              <line
                x2="37.589"
                transform="translate(0 13.5)"
                stroke="#f1f3f2"
                stroke-width="3" />
            </svg>
          </div>

          <transition name="landing">
            <div v-if="navOpen" id="modal-nav">

              <div class="modal-nav-wrapper">
                <div class="modal-nav-container">

                  <ul>
                    <li
                      v-for="(link, index) in navigation.header"
                      :key="index">
                      <component
                        :is="link.type"
                        :to="link.disabled ? '' : link.href"
                        :href="link.disabled ? '' : link.href"
                        :disabled="link.disabled"
                        :target="link.target"
                        class="navigation-link">
                        {{ link.label }}
                      </component>
                    </li>
                  </ul>

                </div>
              </div>

              <div class="social-icon-container">
                <SocialIcons />
              </div>

            </div>
          </transition>

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
  if (!window.matchMedia('(max-width: 40rem)').matches && instance.navOpen) {
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
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      navigation: 'global/navigation',
      filtersActive: 'filters/filtersActive'
    })
  },

  mounted () {
    this.resize = () => { checkScreenWidth(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    toggleNav () {
      this.navOpen = !this.navOpen
      if (this.navOpen) {
        document.body.style.overflow = 'hidden'
        this.$refs.topline.classList.add('top-line')
        this.$refs.bottomline.classList.add('bottom-line')
      } else {
        document.body.style.removeProperty('overflow')
        this.$refs.topline.classList.remove('top-line')
        this.$refs.bottomline.classList.remove('bottom-line')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#header-navigation {
  padding: 1rem 0;
  background-color: #041727;
}

.modal-background {
  background-color: #041727;
}

.filters-view {
  background: linear-gradient(180deg, #041727 0, #062B3F);
}

.navigation-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

#navigation {
  @include small {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  @include mini {
    display: none;
  }
}

.logo,
.navigation-link {
  cursor: pointer;
}

.logo {
  width: 8.625rem;
  opacity: 1.0;
  transition: opacity 0.3s cubic-bezier(0.4, 0.0, 0.2, 1.0);
  &:hover {
    opacity: 0.75;
  }
}

.navigation-link {
  &:not(:last-child) {
    margin-right: 2.75rem;
    @include small {
      margin-right: 1rem;
    }
  }
}

// /////////////////////////////////////////////////////////////////////// Modal
#modal-nav {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 7.5rem;
  left: 0px;
  background: linear-gradient(180deg, #041727 0, #062B3F);
  z-index: 999;
}

.modal-nav-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 75%;
}

.modal-nav-container {
  position: relative;
  margin: 0 3.5rem;
  margin-bottom: 3rem;
  li {
    font-family: $fontMontserrat;
    font-size: 2.1875rem;
    line-height: 1.2;
    font-weight: 500;
    list-style: none;
  }
}

.social-icon-container {
  position: fixed;
  bottom: 0rem;
  margin: 1.5rem 3.5rem;
}

.landing {
  &-enter-active {
    transition: all 300ms cubic-bezier(0.0, 0.0, 0.2, 1.0);
  }
  &-leave-active {
    transition: all 300ms cubic-bezier(0.0, 0.0, 0.2, 1.0);
  }
  &-enter-to,
  &-leave {
    transform: scale(1.0);
    opacity: 1.0;
  }
  &-enter,
  &-leave-to {
    transform: scale(1.1);
    opacity: 0.0;
  }
}

.nav-toggle {
  display: none;
  @include mini {
    display: inline;
  }
  position: relative;
  z-index: 100;
  top: -0.5rem;
  background-color: rgba(255, 0, 0, 0.2);
  &:hover {
    cursor: pointer;
  }
}

#topline {
  position: absolute;
  right: 1rem;
  transition: all 250ms ease-in-out;
}
#bottomline {
  position: absolute;
  right: 1rem;
  transition: all 250ms ease-in-out;
}

.top-line {
  transform: rotate(45deg) translateY(6px);
}

.bottom-line {
  transform: rotate(-45deg) translateY(-6px);
}

</style>
