<template>
  <section id="header-hero">

    <section
      v-if="pageData"
      :class="`panel-top transition ${headerState}`">

      <div :class="`grid-noGutter transition ${headerState} breadcrumbs`">
        <div class="col">
          <Breadcrumbs :breadcrumbs="pageData.breadcrumbs" />
        </div>
      </div>

    </section>

    <section
      v-if="pageData"
      :class="`panel-bottom transition ${headerState}`">

      <div class="grid-noGutter">
        <div class="col-6">

          <div v-if="(headerState === 'index-view')" class="heading">
            <h1>
              {{ pageData.heading }}
            </h1>
          </div>

          <div v-if="(headerState === 'filters-view')" class="filters-heading">
            <h1>
              All Projects
              <span class="display-total">
                ({{ projects.length }})
              </span>
            </h1>
          </div>

          <div v-if="(headerState === 'filters-applied')" class="filters-heading">
            <h1>
              Filtered Results
              <span class="display-total">
                ({{ filteredCollection.length ? filteredCollection.length : '0' }})
              </span>
            </h1>
          </div>

          <div v-if="(headerState === 'index-view')" class="subheading">
            {{ pageData.subheading }}
          </div>

          <div v-if="(headerState === 'filters-view')" class="subheading">
            Showing all projects, no filters selected
          </div>

          <div v-if="(headerState === 'filters-applied')" class="subheading">
            <ul>
              <li v-for="item in categories" :key="item">
                {{ item }}
              </li>
            </ul>
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

import Taxonomy from '@/content/data/taxonomy.json'
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
      navigation: 'global/navigation',
      projects: 'projects/projects',
      activeTags: 'filters/activeTags',
      filteredCollection: 'filters/collection',
      filtersActive: 'filters/filtersActive',
      totalFilters: 'filters/totalFilters'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('index')) {
        return siteContent.index.page_content
      }
      return false
    },
    headerState () {
      if (this.filtersActive) {
        if (this.totalFilters) {
          return 'filters-applied'
        } else {
          return 'filters-view'
        }
      }
      return 'index-view'
    },
    categories () {
      const filters = Taxonomy.categories
      const arr = []
      for (let i = 0; i < filters.length; i++) {
        const tags = this.activeTags[filters[i].label]
        if (tags.length) {
          arr.push(filters[i].label + ': ' + tags.join(', '))
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.transition {
  transition: all 0.5s ease;
  transition-delay: 500ms;
}

// ////////////////////////////////////////////////////////////// [Panel] Bottom
.panel-bottom {
  padding: 0 0 3rem 0;
}

.subheading {
  @include fontSize_Large;
  li {
    list-style: none;
    line-height: 2.0;
    color: $codGray;
  }
}
// ////////////////////////////////////////////////////////////////// Index View
.index-view {
  h1 {
    font-weight: 600;
  }
}

// /////////////////////////////// Filters View (All Projects) & Filters Applied
.filters-applied,
.filters-view {
  background-color: $blackHaze;
  color: $tiber;
  h1 {
    font-weight: 500;
  }
  &.breadcrumbs {
    padding: 5rem 0 3rem 0;
  }
}

.filters-applied {
}

.filters-heading {
  .display-total {
    @include fontSize_Medium;
    font-weight: 300;
    color: $tundora;
  }
}

</style>
