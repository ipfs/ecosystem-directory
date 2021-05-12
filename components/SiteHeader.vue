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

    <section v-if="pageData" class="panel-middle transition" :class="{ allprojects: allActive }">
      <div class="grid-noGutter transition" :class="{ projectview: allActive }">
        <div class="col">
          <Breadcrumbs :breadcrumbs="pageData.breadcrumbs" />
        </div>
      </div>
    </section>

    <section v-if="pageData" class="panel-bottom transition" :class="{ allprojects: allActive }">
      <div class="grid-noGutter">
        <div class="col-6">

          <h1 v-if="!allActive" class="heading">
            {{ pageData.heading }}
          </h1>
          <h1 v-else class="project-heading">
            All Projects
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

  data () {
    return {
      allActive: false
    }
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
  },

  created () {
    this.$nuxt.$on('changeHeader', (val) => {
      this.allActive = val
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#site-header {
  padding: 3rem 0 0 0;
  background-color: $blackPearl;
  color: white;
}

.transition {
  transition: all 0.5s ease;
  transition-delay: 500ms;
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
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

// ////////////////////////////////////////////////////////////// [Panel] Middle
.panel-middle {
  margin-top: 3rem;
}

.projectview {
  padding: 5rem 0 3rem 0;
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
.panel-bottom {
  padding: 0 0 3rem 0;
}

.heading {
  font-weight: 600;
}

.project-heading {
  font-weight: 500;
}

.subheading {
  @include fontSize_Large;
}

// ////////////////////////////////////////////////////////////// All Projects View

.allprojects {
  background-color: $blackHaze;
  color: $tiber;
}

</style>
