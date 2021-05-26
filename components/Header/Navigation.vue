<template>
  <section v-if="navigation" id="header-navigation">

    <div class="grid-noGutter">
      <div class="col">
        <div class="navigation-content">

          <nuxt-link :to="navigation.index.href">
            <img
              class="logo"
              :src="$relativity('/images/logo-horizontal.png')" />
          </nuxt-link>

          <nav id="navigation">
            <component
              :is="link.type"
              v-for="(link, index) in navigation.header"
              :key="index"
              :to="link.disabled ? '' : link.href"
              :disabled="link.disabled"
              :target="link.target"
              class="link">
                {{ link.label }}
              </component>
          </nav>

        </div>
      </div>
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'HeaderNavigation',

  computed: {
    ...mapGetters({
      navigation: 'global/navigation'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
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
}

.logo,
.link {
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

.link {
  font-family: $fontMontserrat;
  line-height: 1.5;
  &:not(:last-child) {
    margin-right: 2.75rem;
    @include small {
      margin-right: 1rem;
    }
  }
  &:after {
    content: "";
    height: 1px;
    bottom: -7px;
    background-color: currentColor;
    position: absolute;
    width: 100%;
    left: 0;
    opacity: 0;
    transition: all .2s cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
  &:hover:after {
    opacity: 1;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
  }
}

</style>
