<template>
  <section v-if="headerState" id="header-hero" :class="`hero-header transition ${headerState}`">

    <section
      v-if="pageData"
      :class="`panel-top transition ${headerState}`">

      <div :class="`grid-noGutter ${headerState} hero-breadcrumbs`">
        <div class="col">
          <Breadcrumbs v-if="breadcrumbs" :breadcrumbs="breadcrumbs" />
        </div>
      </div>

    </section>

    <section
      v-if="pageData"
      :class="`panel-bottom transition ${headerState}`">

      <div class="grid-noGutter">
        <div class="col-9_sm-12">
          <div :class="{'headings-wrapper': true, 'results': (headerState === 'filters-applied')}">

            <div v-if="(headerState === 'index-view')" class="index-heading">
              <h1>
                {{ heading }}
              </h1>
            </div>

            <div v-if="(headerState === 'filters-view')" class="filters-heading">
              <h1>
                {{ heading }}
                <span class="display-total">
                  ({{ projects.length }})
                </span>
              </h1>
            </div>

            <div v-if="(headerState === 'filters-applied')" class="filters-heading">
              <h1>
                {{ heading }}
                <span v-if="showNumberOfResults" class="display-total">
                  ({{ collection.array.length || '0' }})
                </span>
              </h1>
            </div>

            <div v-if="(headerState === 'index-view')" class="index-subheading">
              {{ subheading }}
            </div>

            <div v-if="(headerState === 'filters-view')" class="filters-subheading">
              {{ searchQuery ? searchQuery : subheading }}
            </div>

            <div v-if="(headerState === 'filters-applied')" class="filters-subheading">
              <ul>
                <li v-for="item in categories" :key="item.category">
                  {{ item.category }} <span class="tags">{{ item.tags }}</span>
                </li>
                <li v-if="searchQuery">
                  {{ searchQuery }}
                </li>
              </ul>
            </div>

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
  name: 'ShipyardHero',

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
      settings: 'global/settings',
      navigation: 'global/navigation',
      projects: 'projects/projects',
      taxonomyLabels: 'filters/taxonomyLabels',
      filterValue: 'core/filterValue',
      collection: 'core/collection',
      filterPanelOpen: 'filters/filterPanelOpen',
      categoryLookUp: 'filters/categoryLookUp',
      routeQuery: 'filters/routeQuery'
    }),
    pageData () {
      return this.siteContent.index.page_content
    },
    breadcrumbs () {
      if (this.settings.visibility.breadcrumbs) {
        const breadcrumbs = this.pageData.breadcrumbs
        const headerState = this.headerState
        if (headerState === 'filters-view') { return breadcrumbs.filters_view }
        if (headerState === 'filters-applied') { return breadcrumbs.filters_applied_view }
        return breadcrumbs.index_view
      }
      return false
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
      if (headerState === 'filters-view') { return subheading.filters_view.show_all }
      return subheading.index_view
    },
    searchQuery () {
      if (this.filterValue) {
        const subheading = this.pageData.hero.subheading
        return subheading.filters_view.show_search + ' "' + this.filterValue + '"'
      }
      return false
    },
    ProjectFilters () {
      return this.siteContent.taxonomy.categories
    },
    selectedFilters () {
      if (this.routeQuery.tags) { return this.routeQuery.tags.split(',') }
      return []
    },
    showNumberOfResults () {
      if (this.settings.visibility.hideNumResults) { return false }
      return true
    },
    headerState () {
      const route = this.$route
      if (route.name === 'ipfs-shipyard-ecosystem-directory/index') {
        if (route.query.filters === 'enabled') {
          if (this.selectedFilters.length || this.filterValue !== '') {
            return 'filters-applied'
          } else {
            return 'filters-view'
          }
        }
        return 'index-view'
      }
      return false
    },
    categories () {
      const arr = []
      const len = this.selectedFilters.length
      Object.keys(this.categoryLookUp).forEach((category) => {
        const string = []
        for (let i = 0; i < len; i++) {
          if (this.categoryLookUp[category].tags.includes(this.selectedFilters[i])) {
            string.push(this.taxonomyLabels[this.selectedFilters[i]])
          }
        }
        if (string.length) {
          arr.push({
            category: this.categoryLookUp[category].label + ':',
            tags: string.join(', ')
          })
        }
      })
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.transition {
  transition: all 0.5s ease 0ms;
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
  &.hero-header {
    margin-bottom: 3rem;
  }
}

::v-deep .index-view {
  .breadcrumbs {
    margin-top: 2rem;
  }
  .index-subheading {
    @include fontSize_ExtraLarge;
  }
  h1 {
    @include leading_Mini;
    font-weight: 500;
    margin: 2rem 0;
  }
}

// /////////////////////////////// Filters View (All Projects) & Filters Applied
.filters-applied,
.filters-view {
  h1 {
    @include leading_Mini;
    font-weight: 500;
    margin-top: 2rem;
    margin-bottom: 1rem;
    @include medium {
      font-size: 2.1875rem;
    }
  }
}

::v-deep .filters-applied,
.filters-view {
  .breadcrumbs {
    margin-top: 2rem;
  }
}

.index-heading {
  h1 {
    @include medium {
      font-size: 2.1875rem;
    }
    @include small {
      @include leading_Mini;
      margin: 1rem 0;
    }
  }
}

.filters-heading {
  .display-total {
    @include fontSize_Medium;
    font-weight: 300;
  }
}
</style>
