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
}

.logo {
  width: 8.625rem;
}

.link {
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}
</style>
