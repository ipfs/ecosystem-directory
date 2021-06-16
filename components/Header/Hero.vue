<template>
  <section id="header-hero">

    <section
      v-if="pageData"
      :class="`panel-top transition ${headerState}`">

      <div :class="`grid-noGutter transition ${headerState} hero-breadcrumbs`">
        <div class="col">
          <Breadcrumbs :breadcrumbs="pageData.breadcrumbs" />
        </div>
      </div>

    </section>

    <section
      v-if="pageData"
      :class="`panel-bottom transition ${headerState}`">

      <div class="grid-noGutter">
        <div class="col-9_sm-12">
          <div :class="{'headings-wrapper': true, 'results': (headerState === 'filters-applied')}">

            <h1 :class="['heading', headerState]">
              {{ heading }}
              <span v-if="displayTotal" class="display-total">
                ({{ displayTotal }})
              </span>
              <!-- <template v-if="headerState === 'filters-view'">
                <span class="display-total">
                  ({{ projects.length }})
                </span>
              </template>
              <template v-if="headerState === 'filters-applied'">
                <span class="display-total">
                  ({{ selectedFiltersCount }})
                </span>
              </template> -->
            </h1>

            <!-- <div v-if="(headerState === 'index-view')" class="index-subheading">
              {{ subheading }}
            </div>

            <div v-if="(headerState === 'filters-view')" class="filters-subheading">
              {{ subheading }}
            </div>

            <div v-if="(headerState === 'filters-applied')" class="filters-subheading">
              <ul>
                <li v-for="item in categories" :key="item.category">
                  {{ item.category }} <span class="tags">{{ item.tags }}</span>
                </li>
              </ul>
            </div> -->

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
      filteredCollection: 'core/filteredCollection',
      filterPanelOpen: 'filters/filterPanelOpen',
      selectedFiltersCount: 'filters/selectedFiltersCount'
    }),
    pageData () {
      return this.siteContent.index.page_content
    },
    heading () {
      const heading = this.pageData.hero.heading
      const headerState = this.headerState
      if (headerState === 'filters-view') { return heading.filters_view }
      if (headerState === 'filters-applied') { return heading.filters_applied_view }
      return heading.index_view
    },
    subheading () {
      const subheading = this.pageData.hero.subheading
      const headerState = this.headerState
      if (headerState === 'filters-view') { return subheading.filters_view }
      return subheading.index_view
    },
    headerState () {
      const route = this.$route
      if (route.query.filters === 'enabled') {
        if (this.selectedFiltersCount > 0) {
          return 'filters-applied'
        } else {
          return 'filters-view'
        }
      }
      return 'index-view'
    },
    displayTotal () {
      const selectedFiltersCount = this.selectedFiltersCount
      const projectCount = this.projects.length
      if (this.headerState === 'index-view') { return false }
      if (selectedFiltersCount > 0) { return selectedFiltersCount }
      return projectCount
    },
    categories () {
      const filters = Taxonomy.categories
      const arr = []
      for (let i = 0; i < filters.length; i++) {
        const tags = this.activeTags[filters[i].label]
        if (tags.length) {
          arr.push({
            category: filters[i].label + ':',
            tags: tags.join(', ')
          })
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

.index-subheading,
.filters-subheading {
  @include fontSize_Large;
  li {
    list-style: none;
    line-height: 2.0;
    color: $codGray;
    &:not(:last-child) {
      margin-bottom: 0.25rem;
    }
  }
  .tags {
    font-weight: bold;
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
  color: #181818;
  h1 {
    font-weight: 500;
  }
  &.hero-breadcrumbs {
    padding-top: 5rem;
    padding-bottom: 3rem;
  }
}

.heading {
  h1 {
    @include small {
      @include fontSize_ExtraExtraLarge;
      @include leading_Mini;
      margin: 1rem 0;
    }
  }
}

.index-heading {

}

.filters-heading {
  .display-total {
    @include fontSize_Medium;
    font-weight: 300;
    color: #181818;
  }
}
</style>
