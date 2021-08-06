<template>
  <div
    id="project-view-container"
    ref="projectViewContainer">

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

          <div
            id="filter-panel-close-icon"
            @click="toggleFilterPanel('x-icon')">
            <CloseIcon />
          </div>

          <h4 class="title">
            {{ filterPanelHeading }}
          </h4>

          <FilterBar
            id="filter-bar"
            :filter-value="searchQuery"
            action="store">
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
              v-for="(project, index) in paginated"
              :key="`${project.name}-${(listViewActive ? 'list' : 'block')}`"
              :format="(listViewActive ? 'list-view' : 'block-view')"
              :title="project.name"
              :slug="project.slug"
              :description="project.description.short"
              :logo="project.logo.icon"
              :url="project.primaryCta.url"
              :navigation-behavior="projectCardBehavior"
              :enable-image-alt="enableImageAlt"
              :class="projectCardColumns"
              :style="`animation-delay: ${30 * index}ms`" />
          </div>
        </Paginate>

        <div v-else class="placeholder-results-empty">
          {{ pageData.section_filter.results_empty_placeholder }}
          <span
            class="clear-all-null-results"
            @click="clearSelectedFilters">
            Clear all
          </span>
        </div>

        <div
          v-if="sortedCollection && showPaginationControls"
          id="paginated-list-navigation-controls">

          <PaginationControls
            breaker="..."
            @navigateToPage="navigateToPage">
            <template #first-page>
              <FirstArrow stroke="#494949" />
            </template>
            <template #prev-page>
              <PrevArrow stroke="#494949" />
            </template>
            <template #next-page>
              <NextArrow stroke="#494949" />
            </template>
            <template #last-page>
              <LastArrow stroke="#494949" />
            </template>
          </PaginationControls>

          <ResultsPerPageSelector
            id="results-per-page-selector"
            :label="resultsPerPageDropdownLabel"
            :collection="sortedCollection"
            @changed="resultsPerPageSelectorChanged">
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
import PaginationControls from '@/modules/zero/pagination/Components/Controls'
import ResultsPerPageSelector from '@/modules/zero/pagination/Components/ResultsPerPageSelector'

import CloseIcon from '@/components/Icons/Close'
import SearchIcon from '@/components/Icons/SearchIcon'
import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'

import FirstArrow from '@/components/Icons/FirstArrow'
import PrevArrow from '@/components/Icons/PrevArrow'
import NextArrow from '@/components/Icons/NextArrow'
import LastArrow from '@/components/Icons/LastArrow'

import Settings from '@/content/data/settings.json'

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
    SelectorToggleIcon,
    FirstArrow,
    PrevArrow,
    NextArrow,
    LastArrow
  },

  props: {
    defaultview: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      panelHeight: false,
      listViewActive: this.defaultview,
      scroll: false,
      searchQueryTimer: undefined
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'filters/routeQuery',
      projects: 'projects/projects',
      filterPanelOpen: 'filters/filterPanelOpen',
      filterValue: 'core/filterValue',
      collection: 'core/collection',
      filterButtonFloating: 'global/filterButtonFloating'
    }),
    sortedCollection () {
      return this.collection.array
    },
    display () {
      if (Settings.visibility.hidePagination) {
        return this.projects.length
      }
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
    searchQuery () {
      return this.filterValue
    },
    searchResults () {
      const query = this.searchQuery.toLowerCase()
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
    },
    showPaginationControls () {
      return !Settings.visibility.hidePagination
    },
    projectCardBehavior () {
      return parseInt(Settings.visibility.disableSingulars)
    },
    enableImageAlt () {
      return Settings.visibility.mediaAltAtts
    }
  },

  watch: {
    listViewActive (val) {
      this.setRouteQuery({
        key: 'display-type',
        data: val ? 'list' : 'block'
      })
    },
    searchQuery (query) {
      clearTimeout(this.searchQueryTimer)
      this.searchQueryTimer = setTimeout(() => {
        this.$Countly.trackEvent('Filter Panel Search Input', {
          query
        })
      }, 500)
    }
  },

  mounted () {
    if (!Settings.visibility.hideNonDefaultView) {
      if (this.$route.query['display-type']) {
        if (this.$route.query['display-type'] === 'list') {
          this.listViewActive = true
        } else if (this.$route.query['display-type'] === 'block') {
          this.listViewActive = false
        }
      }
    }
    clearPanelHeight(this)
    this.positionFilterPanelButton()
    this.scroll = this.$throttle(this.positionFilterPanelButton, 10)
    window.addEventListener('scroll', this.scroll)
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      setTotalFilters: 'filters/setTotalFilters',
      setFilterPanelOpen: 'filters/setFilterPanelOpen',
      setFilterButtonFloating: 'global/setFilterButtonFloating'
    }),
    positionFilterPanelButton () {
      const projectViewContainer = this.$refs.projectViewContainer
      const bottom = projectViewContainer.getBoundingClientRect().bottom
      const top = projectViewContainer.parentNode.getBoundingClientRect().top
      const filterButtonFloating = this.filterButtonFloating
      const offset = window.innerWidth <= 640 ? (window.innerWidth * 0.041665) + 84 - 16 : 0
      if (window.innerHeight < top + (window.innerWidth * 0.041665) * 2 + 36 && filterButtonFloating !== 'top') {
        this.setFilterButtonFloating('top')
      } else if (window.innerHeight >= top + (window.innerWidth * 0.041665) * 2 + 36 && bottom >= window.innerHeight + offset && filterButtonFloating !== 'middle') {
        this.setFilterButtonFloating('middle')
      } else if (bottom < window.innerHeight + offset && filterButtonFloating !== 'bottom') {
        this.setFilterButtonFloating('bottom')
      }
    },
    toggleFilterPanel (button) {
      this.setFilterPanelOpen(!this.filterPanelOpen)
      this.$Countly.trackEvent('Filter Panel Toggled', {
        button,
        state: this.filterPanelOpen ? 'open' : 'closed'
      })
      if (!this.routeQuery.hasOwnProperty('filters') || this.routeQuery.filters !== 'enabled') {
        this.setRouteQuery({ key: 'filters', data: 'enabled' })
      }
      clearPanelHeight(this)
      if (!this.filterPanelOpen) {
        this.positionFilterPanelButton()
      }
    },
    toggleListBlockView () {
      this.listViewActive = !this.listViewActive
      this.$Countly.trackEvent('Grid-List View Toggled', {
        view: this.listViewActive ? 'list' : 'grid'
      })
    },
    clearSelectedFilters () {
      this.$refs.filterPanel.clearSelected()
      const timeout = setTimeout(() => {
        this.positionFilterPanelButton()
        clearTimeout(timeout)
      }, 100)
    },
    navigateToPage (page) {
      this.$Countly.trackEvent('Pagination Button Clicked', { page })
    },
    resultsPerPageSelectorChanged (change) {
      const event = change.event
      const data = change.data
      if (event === 'toggleDropdown') {
        this.$Countly.trackEvent('Results-Per-Page Dropdown Toggled', data)
      } else if (event === 'optionSelected') {
        this.$Countly.trackEvent('Results-Per-Page Option Selected', data)
      }
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

// ///////////////////////////////////////////////////////////////////// General
#project-view-container {
  padding-top: 1.5rem;
}

// ///////////////////////////////////////////////////////////////////// Toolbar
#section-toolbar {
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
    width: 100%;
    height: 100%;
    background: linear-gradient(to left, white, transparent);
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

#filter-panel-toolbar {
  margin-bottom: 2rem;
  .title {
    font-family: $fontMontserrat;
    margin-bottom: 0.5rem;
  }
}

::v-deep #filter-bar {
  position: relative;
  .icon-container {
    position: absolute;
    top: 0;
    left: 0;
  }
  .input {
    padding-left: calc(2.25rem - 2px);
    &:focus {
      box-shadow: 0 0 0 5px rgba(0, 123, 255, 0.5);
    }
  }
}

#filter-accordion {
  @include small {
    overflow-y: scroll;
  }
}

// ////////////////////////////////////////////////////////////// Paginated List
#paginated-list {
  flex: 1;
  margin-bottom: 3rem;
  @include small {
    width: 100%;
  }
  @include mini {
    margin-bottom: 4.1665vw;
  }
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
  .clear-all-null-results {
    @include borderRadius3;
    padding: 0.3125rem 0.75rem;
    color: $blackPearl;
    background: $blackHaze;
    transition: 250ms ease-out;
    cursor: pointer;
    &:hover {
      transition: 250ms ease-in;
      background-color: $ming;
      color: white;
    }
  }
}

// ///////////////////////////////////////////////////////// Pagination Controls
#paginated-list-navigation-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  @include small {
    flex-direction: column;
    align-items: flex-end;
    padding: 0 calc(4.1665vw + 0.5rem);
  }
  @include mini {
    align-items: flex-start;
    margin-top: 4rem;
  }
}

.pagination-controls {
  margin-right: 3rem;
  @include small {
    margin-right: 0;
    margin-bottom: 0rem;
  }
  @include mini {
    margin-bottom: 0.5rem;
  }
}

</style>
