<template>
  <header v-if="navigation" id="site-header">

    <section class="panel-top">
      <div class="grid-noGutter">
        <div class="col">
          <div class="panel-top-content">

            <nuxt-link id="header-logo" :to="navigation.index.href">
              <img :src="$relativity('/images/logo-horizontal.png')" />
            </nuxt-link>

            <nav id="header-navigation">
              <component
                :is="link.type"
                v-for="(link, index) in navigation.header"
                :key="index"
                :to="link.disabled ? '' : link.href"
                :disabled="link.disabled"
                :target="link.target"
                class="header-navigation-link">
                {{ link.label }}
              </component>
            </nav>

          </div>
        </div>
      </div>
    </section>

    <section v-if="pageData" class="panel-middle">
      <div class="grid-noGutter">
        <div class="col">
          <Breadcrumbs :breadcrumbs="pageData.breadcrumbs" />
        </div>
      </div>
    </section>

    <section v-if="pageData" class="panel-bottom">
      <div class="grid-noGutter">
        <div class="col-6">

          <h1 class="heading">
            {{ pageData.heading }}
          </h1>

          <div class="subheading">
            {{ pageData.subheading }}
          </div>

        </div>
      </div>
    </section>

  </header>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Breadcrumbs from '@/modules/zero/core/Components/Breadcrumbs'

// ====================================================================== Export
export default {
  name: 'SiteHeader',

  components: {
    Breadcrumbs
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      navigation: 'global/navigation'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('index')) {
        return siteContent.index.page_content
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  padding: 3rem 0;
  background-color: $blackPearl;
  color: white;
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
  margin-bottom: 3rem;
}

.panel-top-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

#header-logo {
  img {
    width: 8.625rem;
  }
}

.header-navigation-link {
  &:not(:last-child) {
    margin-right: 1.6875rem;
  }
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
.heading {
  font-weight: 600;
}

.subheading {
  @include fontSize_Large;
}
</style>
