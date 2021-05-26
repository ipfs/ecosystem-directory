<template>
  <section id="header-hero">

    <section v-if="pageData" class="panel-top transition" :class="{ allprojects: allActive }">
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

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Breadcrumbs from '@/modules/zero/core/Components/Breadcrumbs'

// ====================================================================== Export
export default {
  name: 'HeaderHero',

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
.transition {
  transition: all 0.5s ease;
  transition-delay: 500ms;
}

// ///////////////////////////////////////////////////////////////// [Panel] Top
.panel-top {
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

// /////////////////////////////////////////////////////////// All Projects View
.allprojects {
  background-color: $blackHaze;
  color: $tiber;
}
</style>
