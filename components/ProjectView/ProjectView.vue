<template>
  <div id="project-view-container" ref="projectViewCtn">

    <!-- //////////////////////////////// Filter Toggle / List View controls -->

    <div class="grid-center">
      <div id="card-filters-toggle" class="col-12">

        <div class="filter-panel-controls">
          <Button
            type="C"
            text="Filters"
            :class="{ 'filter-toggle' : true, 'active-button': filterPanel }"
            @clicked="toggleFilterPanel">

            <template #icon-before>
              <FiltersToggle
                class="font-inter"
                :stroke="filterPanel ? '#FFFFFF' : '#052437'" />
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

        <div id="radio-view-toggle" @click.stop="toggleListGridView">

          <div ref="radio" class="selected-background"></div>

          <ListView
            class="radio-toggle-item"
            :stroke="listActive ? '#FFFFFF' : '#052437'" />

          <GridView
            class="radio-toggle-item"
            :stroke="!listActive ? '#FFFFFF' : '#052437'" />

        </div>

      </div>
    </div>

    <!-- ////////////////////////////////////////////////////// Filter Panel -->

    <div id="project-filter-container">

      <div id="filter-panel-wrapper" ref="filterWrap" class="filter-panel-modal">

        <div
          v-if="filterPanel"
          class="filter-panel-heading">

          <div
            class="close-icon"
            @click="toggleFilterPanel">
            <Close />
          </div>

          <h4 class="title">
            All Filters
          </h4>

          <FilterBar filter-value="">
            <template #icon>
              <SearchIcon />
            </template>
          </FilterBar>

        </div>

        <div ref="innerPanel" class="inner-wrapper">

          <FilterPanel
            ref="filterPanel"
            :collection="searchResults"
            :is-active="filterPanel"
            @closeFilters="toggleFilterPanel"
            @totalSelected="updateTotalFilters" />

        </div>
      </div>

      <!-- ////////////////////////////////////////////////// Paginated List -->

      <div id="card-display" ref="cardDisplay" class="card-display auto">

        <Paginate
          v-if="filteredProjects"
          v-slot="{ paginated }"
          :display="display"
          :collection="filteredProjects"
          class="paginate-root">

          <div class="card-list grid">
            <ProjectCard
              v-for="project in paginated"
              :key="project.name"
              :format="(listActive ? 'list-view' : 'block-view')"
              :class="`col-${num}`"
              :title="project.name"
              :slug="project.slug"
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

const setColumnWidth = (instance, element) => {
  if (element) {
    if (instance.listActive) {
      if (element.clientWidth <= 640) {
        if (instance.num !== 12) { instance.num = 12 }
      } else {
        if (instance.num !== 6) { instance.num = 6 }
      }
    } else {
      if (element.clientWidth <= 850) {
        if (element.clientWidth <= 640) {
          if (instance.num !== 6) { instance.num = 6 }
        } else {
          if (instance.num !== 4) { instance.num = 4 }
        }
      } else {
        if (instance.num !== 3) { instance.num = 3 }
      }
    }
  }
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
    ProjectCard
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
      num: 3
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
        this.$refs.filterWrap.classList.remove('filter-closed')
        this.$refs.filterWrap.classList.add('filter-open')

        this.$refs.cardDisplay.style.marginLeft = null
        this.$refs.cardDisplay.style.marginRight = null
        this.$refs.cardDisplay.classList.remove('auto')
        this.$refs.cardDisplay.classList.remove('panel-closed')
        this.$refs.cardDisplay.classList.add('panel-open')
      } else {
        this.$refs.filterWrap.classList.remove('filter-open')
        this.$refs.filterWrap.classList.add('filter-closed')

        this.$refs.cardDisplay.classList.remove('panel-open')
        this.$refs.cardDisplay.classList.add('panel-closed')
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

    this.resize = () => {
      setColumnWidth(this, this.$refs.cardDisplay)
      resetCardDisplayMargin(this.$refs.cardDisplay)
    }
    window.addEventListener('resize', this.resize)

    setColumnWidth(this, this.$refs.cardDisplay)
    setTimeout(() => { setColumnWidth(this, this.$refs.cardDisplay) }, 500)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
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
      setTimeout(() => { setColumnWidth(this, this.$refs.cardDisplay) }, 500)
      if (!this.filtersActive) {
        this.$emit('init-filters')
      }
    },
    toggleListGridView () {
      this.listActive = !this.listActive
      setColumnWidth(this, this.$refs.cardDisplay)
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
  padding: 0;
}

// ///////////////////////////////////////////////////////////// Toggle Controls
button.button.type-C.active-button {
  background-color: $tiber;
  color: white;
}

.filter-toggle {
  @include small {
    position: fixed;
    bottom: 2.5rem;
    left: 2.5rem;
    z-index: 10;
  }
}

#card-filters-toggle {
  display: flex;
  justify-content: space-between;
  padding: 0 0.0rem 1rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
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
    @include small {
      margin: 0;
    }
  }
}

.radio-toggle-item {
  border-radius: 0.25rem;
  white-space: nowrap;
  padding: 0 1.0rem;
  z-index: 10;
}

.selected-background {
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
  position: relative;
  width: 0%;
  background-color: #ffffff;
  transition: width 500ms ease-in-out;
  overflow: hidden;
  border-radius: 0 0.25rem 0.25rem 0;
  .close-icon {
    position: absolute;
    right: 0.75rem;
    top: 0.25rem;
    padding: 0.25rem;
    cursor: pointer;
  }
  @include small {
    position: fixed;
    overflow: scroll;
    height: 100vh;
    width: 0;
    top: 0;
    z-index: 100;
    border-radius: 0;
  }
  &.filter-closed {
    width: 0;
  }
  &.filter-open {
    width: 28.75rem;
    @include small {
      width: 100vw;
    }
  }
}

.filter-panel-heading {
  margin: 2.5rem 0;
  margin-right: 2.5rem;
  margin-left: 24%;
  @include small {
    margin: 0;
    padding: 1.5rem 2.5rem;
    width: 100vw;
    position: fixed;
    background-color: #ffffff;
    z-index: 100;
  }
  .title {
    font-family: $fontMontserrat;
    font-weight: 400;
    margin: 6px;
  }
}

.inner-wrapper {
  font-family: $fontInter;
  position: relative;
  margin-left: 24%;
  @include small {
    top: 6rem;
    margin: 2.5rem;
    margin-bottom: 18rem;
  }
}

::v-deep .bottom-buttons {
  @include small {
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    width: 100%;
    z-index: 100;
    padding: 1.0rem 0;
    margin: 0;
  }
}

// /////////////////////////////////////////////////////////////// Project Cards
.card-display {
  transition: all 500ms ease-in-out;
  &.auto {
    width: 67.5rem;
  }
}

.panel-open {
  width: 66%;
  margin-left: 3%;
  margin-right: 8%;
}

.panel-closed {
  width: 67.5rem;
  margin-left: 16%;
  margin-right: 16%;
}

.paginate-root {
  width: 100%;
}

img {
  width: 100%;
  height: 100%;
}

::v-deep .card-list {
  width: inherit;
  &.layout-grid {
    flex-flow: row wrap;
  }
  &.layout-list {
    flex-flow: row wrap;
  }
}

::v-deep .project-card {
  &.block-view {
    margin-bottom: 1rem;
    .thumbnail {
      height: 11.25rem;
    }
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
  flex-wrap: wrap;
  margin-top: 3rem;
  justify-content: center;
}

.results-selector-wrapper {
  height: 2.5rem;
  margin-bottom: 5rem;
  @include tiny {
    margin-top: 1rem;
  }
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
