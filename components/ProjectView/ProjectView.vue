<template>
  <div id="project-view-container" ref="projectViewCtn">

    <!-- //////////////////////////////// Filter Toggle / List View controls -->

    <div class="grid-center">
      <div id="card-filters-toggle" class="col-12">

        <div class="filter-panel-controls">
          <Button
            type="C"
            text="Filters"
            :class="{ activeButton: filtersActive }"
            @clicked="toggleFilterPanel">

            <template #icon-before>
              <FiltersToggle
                class="font-inter"
                :stroke="filtersActive ? '#FFFFFF' : '#052437'" />
            </template>

          </Button>

          <Button
            v-if="totalFilters"
            type="C"
            :text="`Clear (${totalFilters}) Selected`"
            class="clear-selected"
            @clicked="clearSelectedFilters">
            <template #icon-after>
              <Close />
            </template>
          </Button>

        </div>

        <div class="radio-sort-wrapper">

          <SortBySelector
            class="sort-by-root"
            :display-options="['A-Z', 'Time on IPFS', 'none']">
            <template #dropdown-icon>
              <SelectorToggle stroke="#052437" />
            </template>
          </SortBySelector>

          <div id="radio-view-toggle" @click.stop="toggleListGridView">

            <div ref="radio" class="selected-blackground"></div>

            <ListView
              class="radio-toggle-item"
              :stroke="listActive ? '#FFFFFF' : '#052437'" />

            <GridView
              class="radio-toggle-item"
              :stroke="!listActive ? '#FFFFFF' : '#052437'" />

          </div>
        </div>

      </div>
    </div>

    <!-- ////////////////////////////////////////////////////// Filter Panel -->

    <div id="project-filter-container">
      <div id="filter-panel-wrapper" ref="filterWrap">
        <div class="filter-panel inner-wrapper">

          <div
            class="close-icon"
            @click="toggleFilterPanel">
            <Close />
          </div>

          <div
            v-if="filterPanel"
            class="filter-panel-heading">

            <h4 class="title">
              All Filters
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
            :is-active="filterPanel"
            @closeFilters="toggleFilterPanel"
            @totalSelected="updateTotalFilters" />

        </div>
      </div>

      <!-- ////////////////////////////////////////////////// Paginated List -->

      <div id="card-display" ref="cardDisplay">

        <Paginate
          v-if="filteredProjects"
          v-slot="{ paginated }"
          :display="display"
          :collection="filteredProjects"
          class="paginate-root">

          <div :class="['card-list', listActive ? 'layout-list' : 'layout-grid', { 'layout-filter-panel-open': filterPanel }]">
            <ProjectCard
              v-for="project in paginated"
              :key="project.name"
              :format="(listActive ? 'list-view' : 'block-view')"
              :title="project.name"
              :description="project.description.short"
              :logo="project.logo.icon" />
          </div>

        </Paginate>

        <div v-else class="placeholder-results-empty">
          {{ pageData.section_filter.results_empty_placeholder }}
        </div>

        <div v-if="filteredProjects" class="page-navigation-controls">

          <PaginationControls />

          <div class="results-selector-wrapper">
            <ResultsPerPageSelector
              :collection="filteredProjects"
              class="results-per-page font-inter">

              <template #dropdown-icon>
                <SelectorToggle stroke="#052437" />
              </template>

            </ResultsPerPageSelector>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Paginate from '@/modules/zero/pagination/Components/Paginate'
import ResultsPerPageSelector from '@/modules/zero/pagination/Components/ResultsPerPageSelector'
import Button from '@/modules/zero/core/Components/Button'
import SelectorToggle from '@/modules/zero/core/Components/Icons/SelectorToggle'
import FiltersToggle from '@/modules/zero/core/Components/Icons/FiltersToggle'
import ListView from '@/components/Icons/ListView'
import GridView from '@/components/Icons/GridView'
import FilterBar from '@/modules/zero/core/Components/FilterBar'
import SortBySelector from '@/modules/zero/filters/Components/SortBySelector'
import SearchIcon from '@/components/Icons/SearchIcon'
import Close from '@/components/Icons/Close'
import FilterPanel from '@/components/FilterPanel/FilterPanel'
import PaginationControls from '@/components/ProjectView/PaginationControls'
import ProjectCard from '@/components/ProjectView/ProjectCard'

// =================================================================== Functions
const resetCardDisplayMargin = (element) => {
  element.style.marginLeft = 'auto'
  element.style.marginRight = 'auto'

  const ml = getComputedStyle(element).marginLeft
  const mr = getComputedStyle(element).marginRight

  element.style.marginLeft = ml
  element.style.marginRight = mr
}

// ====================================================================== Export
export default {
  name: 'ProjectView',

  components: {
    Paginate,
    PaginationControls,
    ResultsPerPageSelector,
    SelectorToggle,
    FiltersToggle,
    ListView,
    GridView,
    Button,
    FilterBar,
    FilterPanel,
    SearchIcon,
    Close,
    ProjectCard,
    SortBySelector
  },

  props: {
    allProjects: {
      type: [Boolean, Array],
      default: false,
      required: false
    }
  },

  data () {
    return {
      projects: false,
      paginationDisplay: 20,
      filterPanel: false,
      totalFilters: 0,
      listActive: false,
      resize: false,
      searchQuery: ''
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      page: 'pagination/page',
      totalPages: 'pagination/totalPages',
      display: 'pagination/display',
      filteredProjects: 'filters/collection',
      filtersActive: 'filters/filtersActive'
    }),
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('index')) {
        return siteContent.index.page_content
      }
      return false
    },
    searchResults () {
      const query = this.searchQuery
      const regex = new RegExp(query, 'i')
      const projects = this.allProjects
      const len = projects.length
      const arr = []
      if (this.searchQuery) {
        for (let i = 0; i < len; i++) {
          const name = projects[i].name
          if (typeof name === 'string') {
            if (regex.test(name)) {
              arr.push(projects[i])
            }
          }
        }
        return arr
      }
      return projects
    }
  },

  watch: {
    filterPanel (val) {
      if (val) {
        this.$refs.filterWrap.style.width = '34%'
        this.$refs.cardDisplay.style.width = '66%'
        this.$refs.cardDisplay.style.marginLeft = '3%'
        this.$refs.cardDisplay.style.marginRight = '8%'
      } else {
        this.$refs.filterWrap.style.width = '0'
        this.$refs.cardDisplay.style.width = '67.5rem'
        this.$refs.cardDisplay.style.marginLeft = '16%'
        this.$refs.cardDisplay.style.marginRight = '16%'
        setTimeout(() => { resetCardDisplayMargin(this.$refs.cardDisplay) }, 500)
      }
    }
  },

  created () {
    this.$nuxt.$on('view-all-projects', () => {
      this.toggleFilterPanel()
    })
  },

  mounted () {
    resetCardDisplayMargin(this.$refs.cardDisplay)
    this.filterPanel = (this.$route.query.filters === 'enabled')
  },

  methods: {
    ...mapActions({
      setPage: 'pagination/setPage',
      setTotalPages: 'pagination/setTotalPages',
      setDisplay: 'pagination/setDisplay',
      setCollection: 'pagination/setCollection',
      clearStore: 'pagination/clearStore',
      setFiltersActive: 'filters/setFiltersActive',
      setTotalFilters: 'filters/setTotalFilters'
    }),
    toggleFilterPanel () {
      this.filterPanel = !this.filterPanel
      if (!this.totalFilters) {
        this.setFiltersActive(this.filterPanel)
        if (this.filterPanel) {
          this.$router.push({ path: '/', query: { filters: 'enabled' } })
          window.scrollTo(0, 0) // not sure where to trigger this
        } else {
          this.$router.push(this.$route.path)
        }
      }
    },
    toggleListGridView () {
      this.listActive = !this.listActive
      this.$refs.radio.style.left = this.listActive ? '0%' : '50%'
    },
    updateTotalFilters (val) {
      this.totalFilters = val
      this.setTotalFilters(val)
    },
    clearSelectedFilters () {
      this.$refs.filterPanel.clearSelected()
    },
    setSearchQuery (val) {
      this.searchQuery = val
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#project-view-container {
  width: 100%;
  min-width: 600px;
  padding: 0;
}

// ///////////////////////////////////////////////////////////// Toggle Controls
button.button.type-C.activeButton {
  background-color: $tiber;
  color: white;
}

#card-filters-toggle {
  display: flex;
  justify-content: space-between;
  padding: 0 0.0rem 1rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
}

.radio-sort-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .sort-by-root {
    @include borderRadius3;
    position: relative;
    height: 2.25rem;
    background-color: #FFFFFF;
    white-space: nowrap;
    padding: 0.25rem 1.0rem;
    margin: 0 1rem;
    cursor: pointer;
    font-family: $fontInter;
    font-weight: 400;
    line-height: 1.7;
  }
}

#radio-view-toggle {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 2.25rem;
  background-color: #FFFFFF;
  border-radius: 0.25rem;
  cursor: pointer;
  &.hide {
    opacity: 0;
  }
}

.filter-panel-controls {
  display: flex;
  position: relative;
  .clear-selected {
    @include borderRadius3;
    position: relative;
    height: 2.25rem;
    background-color: #FFFFFF;
    white-space: nowrap;
    padding: 0 0.75rem;
    margin: 0 0.75rem;
    cursor: pointer;
  }
}

.radio-toggle-item {
  border-radius: 0.25rem;
  white-space: nowrap;
  padding: 0 1.0rem;
  z-index: 10;
}

.selected-blackground {
  display: inline-block;
  position: absolute;
  width: 50%;
  left: 50%;
  min-height: 2.25rem;
  background-color: $tiber;
  border-radius: 0.25rem;
  transition: left 300ms cubic-bezier(.61,1.6,.64,.88);
}

// //////////////////////////////////////////////////////////////// Filter Panel
#project-filter-container {
  width: 100vw;
  position: relative;
  display: flex;
  justify-content: center;
}

#filter-panel-wrapper {
  display: block;
  width: 0%;
  background-color: #ffffff;
  transition: width 500ms ease-in-out;
  overflow: hidden;
  border-radius: 0 0.25rem 0.25rem 0;
}

.filter-panel-heading {
  margin: 2.5rem 0;
  margin-right: 2.5rem;
  .title {
    font-family: $fontMontserrat;
    font-weight: 400;
    margin: 6px;
  }
}

.filter-panel {
  font-family: $fontInter;
  &.inner-wrapper {
    position: relative;
    width: 76%;
    height: 100%;
    margin-left: 24%;
    overflow: hidden;
  }
  .close-icon {
    position: absolute;
    right: 0.75rem;
    top: 0.25rem;
    padding: 0.25rem;
    cursor: pointer;
  }
}

// /////////////////////////////////////////////////////////////// Project Cards
#card-display {
  width: 67.5rem;
  margin: 0 auto;
  transition: all 500ms ease-in-out;
}

.paginate-root {
  width: 100%;
}

img {
  width: 100%;
  height: 100%;
}

::v-deep .card-list {
  display: flex;
  flex-flow: row wrap;
  &.layout-filter-panel-open {
    .project-card {
      &.block-view {
        width: 33.333%;
        .thumbnail {
          height: 11.25rem;
        }
      }
      &.list-view {
        width: 50%;
      }
    }
  }
}

::v-deep .project-card {
  &.block-view {
    width: 25%;
    margin-bottom: 1rem;
  }
  &.list-view {
    width: 33.333%;
  }
}

.placeholder-results-empty {
  @include borderRadius3;
  padding: 2rem;
  font-weight: 600;
  text-align: center;
  background-color: white;
}

// ///////////////////////////////////////////////////////// Pagination Controls
.font-inter {
  font-family: $fontInter;
  font-weight: 400;
}

.page-navigation-controls {
  display: flex;
  margin-top: 3rem;
  justify-content: center;
}

.results-selector-wrapper {
  height: 2.5rem;
  margin-bottom: 5rem;
}

.results-per-page {
  position: relative;
  top: 1.25rem;
  transform: translateY(-50%);
  background-color: #FFFFFF;
  @include borderRadius3;
  padding: 0.25rem 1.0rem;
}
</style>
