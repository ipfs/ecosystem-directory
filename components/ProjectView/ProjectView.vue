<template>
  <div id="project-view-container" ref="projectViewCtn">

    <!-- //////////////////////////////// Filter Toggle / List View controls -->

    <div class="grid-center">
      <div id="card-filters-toggle" class="col-12">

        <div class="filter-panel-controls">
          <Button
            type="C"
            text="Filters"
            :class="{ activeButton: filterActive }"
            @clicked="toggleFilterPanel">

            <template #icon-before>
              <FiltersToggle
                class="font-inter"
                :stroke="filterActive ? '#ffffff' : '#052437'" />
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

          <div ref="radio" class="selected-blackground"></div>

          <ListView
            class="radio-toggle-item"
            :stroke="listActive ? '#ffffff' : '#052437'" />

          <GridView
            class="radio-toggle-item"
            :stroke="!listActive ? '#ffffff' : '#052437'" />

        </div>

      </div>
    </div>

    <!-- //////////////////////////////// Filter Toggle / List View controls -->

    <div id="project-filter-container">
      <!-- ========================================== Filter Panel Component -->

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

            <FilterBar filter-value="">
              <template #icon>
                <SearchIcon />
              </template>
            </FilterBar>

          </div>

          <FilterPanel
            ref="filterPanel"
            :collection="allProjects"
            :is-active="filterPanel"
            @closeFilters="toggleFilterPanel"
            @totalSelected="updateTotalFilters" />

        </div>
      </div>

      <!-- ========================================== Filter Panel Component -->

      <!-- /////////////////////////////////////////Paginated List Component -->

      <div id="card-display" ref="cardDisplay">

        <Paginate
          v-if="filteredProjects"
          v-slot="{ paginated }"
          :display="display"
          :collection="filteredProjects"
          class="paginate-root">

          <div :class="(listActive ? 'card-list-flex' : 'paginated-grid')">
            <ProjectCard
              v-for="(project, index) in paginated"
              :key="project.name"
              :format="(listActive ? 'list-view' : 'grid-view')"
              :title="project.name"
              :description="project.description.short"
              :logo="project.logo.icon" />
          </div>

        </Paginate>

        <div class="page-navigation-controls">

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
      <!-- /////////////////////////////////////////Paginated List Component -->
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
import FilterBar from '@/components/FilterPanel/FilterBar'
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
      filters: false,
      filterActive: false,
      filterPanel: false,
      totalFilters: 0,
      listActive: false,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      page: 'pagination/page',
      totalPages: 'pagination/totalPages',
      display: 'pagination/display',
      filteredProjects: 'filters/collection'
    })
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
      this.$emit('hide-segment-chart', this.filterActive)
    }
  },

  created () {
    this.$nuxt.$on('view-all-projects', () => {
      this.toggleFilterPanel()
    })
  },

  mounted () {
    if (this.$route.query.filters === 'enabled') {
      this.filterActive = true
    } else {
      this.filterActive = false
    }

    resetCardDisplayMargin(this.$refs.cardDisplay)
  },

  methods: {
    ...mapActions({
      setPage: 'pagination/setPage',
      setTotalPages: 'pagination/setTotalPages',
      setDisplay: 'pagination/setDisplay',
      setCollection: 'pagination/setCollection',
      clearStore: 'pagination/clearStore'
    }),
    toggleFilterPanel () {
      this.filterPanel = !this.filterPanel
      if (!this.totalFilters) {
        this.filterActive = this.filterPanel
        if (this.filterActive) {
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
    },
    clearSelectedFilters () {
      this.$refs.filterPanel.clearSelected()
    }
  }
}
</script>

<style lang="scss" scoped>

#project-view-container {
  width: 100%;
  min-width: 600px;
  padding: 0;
  margin-bottom: 3rem;
}

// /////////////////////////////////////////////////////////// [TOGGLE CONTROLS]

.activeButton {
  background-color: #052437;
  color: #ffffff;
}

#card-filters-toggle {
  padding: 0 0.0rem 1rem;
  margin-top: 1rem;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
}

#radio-view-toggle {
  display: flex;
  position: relative;
  height: 2.25rem;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 0.25rem;
  flex-direction: row;
  align-items: center;
  &.hide {
    opacity: 0;
  }
}

.filter-panel-controls {
  display: flex;
  position: relative;
  .clear-selected {
    position: relative;
    height: 2.25rem;
    cursor: pointer;
    background-color: #ffffff;
    @include borderRadius3;
    white-space: nowrap;
    padding: 0 0.75rem;
    margin: 0 0.75rem;
  }
}

.radio-toggle-item {
  border-radius: 0.25rem;
  width: 100%;
  height: 100%;
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

// ////////////////////////////////////////////////////////////// [FILTER PANEL]

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
  flex-basis: content;
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

// ///////////////////////////////////////////////////////////// [PROJECT CARDS]

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

.paginated-grid {
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin: 0 auto;
}

.card-list-flex {
  display: flex;
  flex-wrap: wrap;
}

// /////////////////////////////////////////////////////// [PAGINATION CONTROLS]

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
