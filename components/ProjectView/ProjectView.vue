<template>
  <div id="project-view-container">

    <!-- /////////////////////////////////////////////////////////// Toolbar -->
    <section id="section-toolbar">
      <div class="grid-noGutter">
        <div class="col">

          <Toolbar
            :filter-panel-open="filterPanelOpen"
            :list-view-active="listViewActive"
            @toggleFilterPanel="toggleFilterPanel"
            @toggleListBlockView="toggleListBlockView"
            @clearSelectedFilters="clearSelectedFilters" />

        </div>
      </div>
    </section>

    <!-- //////////////////////////////////////////// Filtering and Projects -->
    <div id="filter-panel-project-list-container" :class="{ 'filter-panel-open': filterPanelOpen }">
      <!-- ============================================ Filter Panel Wrapper -->
      <div id="filter-panel-wrapper" ref="panelWrapper" :style="`height: ${toggleHeight};`">
        <div id="filter-panel-toolbar">

          <div id="filter-panel-close-icon" @click="toggleFilterPanel">
            <CloseIcon />
          </div>

          <h4 class="title">
            {{ filterPanelHeading }}
          </h4>

          <FilterBar
            :filter-value="searchQuery"
            @setFilterValue="setSearchQuery">
            <template #icon>
              <SearchIcon />
            </template>
          </FilterBar>

        </div>

        <FilterPanel
          ref="filterPanel"
          :collection="searchResults"
          @toggleFilterPanel="toggleFilterPanel" />

      </div>

      <!-- ================================================== Paginated List -->
      <div id="paginated-list">

        <Paginate
          v-if="sortedCollection"
          v-slot="{ paginated }"
          :display="display"
          :collection="sortedCollection"
          class="paginate-root">
          <div class="grid">
            <ProjectCard
              v-for="project in paginated"
              :key="project.name"
              :format="(listViewActive ? 'list-view' : 'block-view')"
              :title="project.name"
              :slug="project.slug"
              :description="project.description.short"
              :logo="project.logo.icon"
              :class="projectCardColumns" />
          </div>
        </Paginate>

        <div v-else class="placeholder-results-empty">
          {{ pageData.section_filter.results_empty_placeholder }}
        </div>

        <div v-if="sortedCollection" id="paginated-list-navigation-controls">

          <PaginationControls />

          <ResultsPerPageSelector
            id="results-per-page-selector"
            :label="resultsPerPageDropdownLabel"
            :collection="sortedCollection">
            <template #dropdown-icon>
              <SelectorToggleIcon />
            </template>
          </ResultsPerPageSelector>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Toolbar from '@/components/ProjectView/Toolbar'
import FilterBar from '@/modules/zero/core/Components/FilterBar'
import FilterPanel from '@/components/FilterPanel/FilterPanel'
import Paginate from '@/modules/zero/pagination/Components/Paginate'
import ProjectCard from '@/components/ProjectView/ProjectCard'
import PaginationControls from '@/components/ProjectView/PaginationControls'
import ResultsPerPageSelector from '@/modules/zero/pagination/Components/ResultsPerPageSelector'

import CloseIcon from '@/components/Icons/Close'
import SearchIcon from '@/components/Icons/SearchIcon'
import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'
// =================================================================== Functions
const clearPanelHeight = (instance) => {
  if (!instance.filterPanelOpen) {
    const h = instance.$refs.panelWrapper.offsetHeight
    instance.panelHeight = h
    setTimeout(() => { instance.panelHeight = 0 }, 100)
  }
}

// ====================================================================== Export
export default {
  name: 'ProjectView',

  components: {
    Toolbar,
    FilterBar,
    FilterPanel,
    CloseIcon,
    SearchIcon,
    Paginate,
    ProjectCard,
    PaginationControls,
    ResultsPerPageSelector,
    SelectorToggleIcon
  },

  data () {
    return {
      panelHeight: false,
      listViewActive: false,
      searchQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      projects: 'projects/projects',
      filterPanelOpen: 'filters/filterPanelOpen',
      collection: 'core/collection'
    }),
    sortedCollection () {
      return this.collection.array
    },
    display () {
      return this.routeQuery.results
    },
    pageData () {
      return this.siteContent.index.page_content
    },
    sectionFilterContent () {
      return this.siteContent.index.page_content.section_filter
    },
    filterPanelHeading () {
      return this.pageData.section_filter.filter_panel.heading
    },
    resultsPerPageDropdownLabel () {
      return this.pageData.section_filter.results_per_page_dropdown_label
    },
    searchResults () {
      const query = this.searchQuery
      return this.projects.filter((project) => {
        const matched = project.name.toLowerCase().includes(query) || project.org.join('').toLowerCase().includes(query)
        if (!matched) { return false }
        return project
      })
    },
    projectCardColumns () {
      if (this.filterPanelOpen) {
        if (this.listViewActive) { return 'col-6_md-12_sm-6_mi-12' }
        return 'col-4_md-6_sm-4_mi-6'
      } else {
        if (this.listViewActive) { return 'col-4_md-6_mi-12' }
        return 'col-3_sm-4_mi-6'
      }
    },
    toggleHeight () {
      if (this.filterPanelOpen) { return 'unset' }
      return this.panelHeight + 'px'
    }
  },

  watch: {
    listViewActive (val) {
      this.setRouteQuery({
        key: 'display-type',
        data: val ? 'list' : 'block'
      })
    }
  },

  mounted () {
    if (this.$route.query['display-type']) {
      if (this.$route.query['display-type'] === 'list') {
        this.listViewActive = true
      } else if (this.$route.query['display-type'] === 'block') {
        this.listViewActive = false
      }
    }
    clearPanelHeight(this)
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setTotalFilters: 'filters/setTotalFilters',
      setFilterPanelOpen: 'filters/setFilterPanelOpen'
    }),
    toggleFilterPanel (forceOpen) {
      this.setFilterPanelOpen(!this.filterPanelOpen)
      if (!this.routeQuery.hasOwnProperty('filters') || this.routeQuery.filters !== 'enabled') {
        this.setRouteQuery({ key: 'filters', data: 'enabled' })
      }
      clearPanelHeight(this)
    },
    toggleListBlockView () {
      this.listViewActive = !this.listViewActive
    },
    clearSelectedFilters () {
      this.$refs.filterPanel.clearSelected()
    },
    setSearchQuery (query) {
      this.searchQuery = query
    }
  }
}
</script>

<style lang="scss" scoped>
$gutter: calc((100vw - #{$containerWidth}) / 2);
$gutter_Negative: calc(((100vw - #{$containerWidth}) / 2) * -1);
$gutter_ContainerSingleColumn: 100vw * 0.041665;
$filterPanelWidth: 20rem;
$filterPanelPadding_Top: 2.5rem;
$filterPanelPadding_Right: 2.5rem;
$filterPanelPadding_Left: 0rem;
$filterPanelPadding_Bottom: 6rem;
$paginateRoot_PaddingOffset: 3.5rem;

// ///////////////////////////////////////////////////////////////////// Toolbar
#section-toolbar {
  margin-top: 1.5rem;
  margin-bottom: 3rem;
}

// //////////////////////////////////////////////////////////////// Filter Panel
#filter-panel-project-list-container {
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 0 $gutter;
  @include containerMaxMQ {
    margin: 0;
  }
  &.filter-panel-open {
    #filter-panel-wrapper {
      margin-left: 0;
      transform: translateX(0);
      @include customMaxMQ ($containerWidth + 4rem) {
        padding-left: calc(#{$gutter_ContainerSingleColumn} - #{$gutter});
      }
      @include containerMaxMQ {
        padding-left: $gutter_ContainerSingleColumn;
      }
      @include small {
        padding-left: 2.5rem;
      }
    }
    .paginate-root {
      padding-left: 0.5rem;
      @include small {
        padding-left: $gutter_ContainerSingleColumn;
      }
    }
  }
}

#filter-panel-wrapper {
  position: relative;
  padding: $filterPanelPadding_Top $filterPanelPadding_Right $filterPanelPadding_Bottom $filterPanelPadding_Left;
  background-color: white;
  margin-left: calc(-#{$filterPanelWidth} - #{$filterPanelPadding_Right} - #{$filterPanelPadding_Left});
  transform: translateX($gutter_Negative);
  transition: transform 250ms ease-in-out, margin-left 250ms ease-in-out, height 250ms ease-in-out;
  @include containerMaxMQ {
    margin-left: calc(-#{$filterPanelWidth} - #{$filterPanelPadding_Right} - #{$filterPanelPadding_Left});
    transform: translateX(-$gutter_ContainerSingleColumn);
  }
  @include small {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100% !important;
    margin-left: 0;
    padding-bottom: 2.5rem;
    padding-left: 2.5rem;
    transform: translate(0, 100%);
    overflow-y: scroll;
    z-index: 10000;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 100%;
    width: $gutter;
    height: 100%;
    background-color: white;
    @include small {
      display: none;
    }
  }
}

#filter-panel-close-icon {
  position: absolute;
  top: 0.25rem;
  right: 0.75rem;
  padding: 0.25rem;
  cursor: pointer;
}

#filter-panel-toolbar,
#filter-panel {
  width: $filterPanelWidth;
  @include small {
    width: 100%;
  }
}

// #filter-panel-toolbar,
// #filter-panel-controls {
//   @include small {
//     position: absolute;
//     left: 0;
//   }
// }

#filter-panel-toolbar {
  // @include small {
  //   top: 0;
  // }
  margin-bottom: 2rem;
  .title {
    font-family: $fontMontserrat;
    margin-bottom: 0.5rem;
  }
}

#filter-accordion {
  @include small {
    overflow-y: scroll;
  }
}

// #filter-panel-controls {
//   @include small {
//     bottom: 0;
//   }
// }

// ////////////////////////////////////////////////////////////// Paginated List
#paginated-list {
  flex: 1;
  margin-bottom: 3rem;
}

.paginate-root {
  padding: 0 $paginateRoot_PaddingOffset;
  transition: 250ms ease-in-out;
  @include containerMaxMQ {
    padding: 0 $gutter_ContainerSingleColumn;
  }
}

.grid {
  width: auto;
  padding: 0;
  @include containerMaxMQ {
    width: 100%;
  }
}

.placeholder-results-empty {
  @include borderRadius3;
  padding: 2rem;
  margin: 0 $paginateRoot_PaddingOffset;
  font-weight: 600;
  text-align: center;
  background-color: white;
}

// ///////////////////////////////////////////////////////// Pagination Controls
#paginated-list-navigation-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination-control-wrapper {
  margin-right: 3rem;
}
</style>
