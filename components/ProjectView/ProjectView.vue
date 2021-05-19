<template>
  <div id="project-view-container" ref="projectViewCtn">

    <!-- Filter Toggle / List View controls -->

    <div id="card-filters-toggle">

      <Button type="C" text="Filters" :class="{ activeButton: filterActive }" @clicked="toggleFilterPanel">

        <template #icon-before>
          <FiltersToggle
            class="font-inter"
            :stroke="filterActive ? '#ffffff' : '#052437'" />
        </template>

      </Button>

      <div id="radio-view-toggle">

        <Button type="C" :class="{ activeButton: listActive }" @clicked="toggleListGridView">
          <template #icon-before>
            <ListView :stroke="listActive ? '#ffffff' : '#052437'" />
          </template>
        </Button>

        <Button type="C" :class="{ activeButton: !listActive }" @clicked="toggleListGridView">
          <template #icon-before>
            <GridView :stroke="!listActive ? '#ffffff' : '#052437'" />
          </template>
        </Button>

      </div>

    </div>

    <div id="project-filter-container">
      <!-- Filter Panel Component -->

      <div id="filter-panel-wrapper" ref="filterWrap">
        <div class="filter-panel inner-wrapper">
          <FilterPanel
            :collection="allProjects" />
        </div>
      </div>

      <!-- Paginated List Component -->

      <div id="card-display" ref="cardDisplay">

        <Paginate
          v-if="allProjects"
          v-slot="{ paginated }"
          :display="display"
          :collection="allProjects"
          class="card-grid">
          <template v-for="(project, index) in paginated">
            <div
              v-if="paginated"
              :key="index"
              class="card-container"
              :style="`grid-column: ${index % 4 + 1}; grid-row: ${Math.ceil((1 + index) / 4)};`">

              <div class="card">
                <div class="card-logo">
                  <img :src="logos(project.logo.icon)" :alt="project.name" />
                </div>
              </div>

              <label>{{ project.name }}</label>

              <p>{{ project.description.short }}</p>
            </div>
          </template>
        </Paginate>

        <div class="page-navigation-controls">

          <PaginationControls />

          <div class="results-selector-wrapper">
            <ResultsPerPageSelector :collection="allProjects" class="results-per-page font-inter">

              <template #dropdown-icon>
                <SelectorToggle />
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
import ListView from '@/modules/zero/core/Components/Icons/ListView'
import GridView from '@/modules/zero/core/Components/Icons/GridView'
import FiltersToggle from '@/modules/zero/core/Components/Icons/FiltersToggle'
import FilterPanel from '../FilterPanel/FilterPanel'
import PaginationControls from './PaginationControls'

import SampleProjects from '~/content/sample/sampleProjects.json'

// ===================================================================== Functions
const processProjects = (instance) => {
  instance.projects = instance.collection
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
    FilterPanel
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
      listActive: false,
      resize: false
    }
  },

  computed: {
    ...mapGetters({
      page: 'pagination/page',
      totalPages: 'pagination/totalPages',
      display: 'pagination/display',
      collection: 'pagination/collection'
    }),
    ProjectList () {
      const projects = this.projects
      return projects
    }
  },

  watch: {
    filterActive (val) {
      if (val) {
        this.$refs.filterWrap.style.width = '100%'
        this.$refs.cardDisplay.style.marginLeft = '5%'
        this.$refs.cardDisplay.style.marginRight = '0%'
      } else {
        this.$refs.filterWrap.style.width = '0%'
        this.$refs.cardDisplay.style.marginLeft = '18%'
        this.$refs.cardDisplay.style.marginRight = '4%'
      }
      this.$emit('hide-segment-chart', val)
    }
  },

  mounted () {
    this.setCollection(SampleProjects.projects)
    processProjects(this) // fill projects collection
  },

  methods: {
    ...mapActions({
      setPage: 'pagination/setPage',
      setTotalPages: 'pagination/setTotalPages',
      setDisplay: 'pagination/setDisplay',
      setCollection: 'pagination/setCollection',
      clearStore: 'pagination/clearStore'
    }),
    logos (path) {
      let icon
      try {
        icon = require('~/assets/logos/' + path)
      } catch (e) {
        console.log(e)
      }
      if (icon) { return icon }
    },
    toggleFilterPanel () {
      this.filterActive = !this.filterActive
    },
    toggleListGridView () {
      this.listActive = !this.listActive
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  #project-view-container {
    min-width: 600px;
  }

  // ////////////////////////////////////////////////////////////// [TOGGLE CONTROLS]

  .activeButton {
    background-color: #052437;
    color: #ffffff;
  }

  #card-filters-toggle {
    margin-top: 1rem;
    margin-bottom: 3rem;
    margin-left: 12%;
    margin-right: 12%;
    display: flex;
    justify-content: space-between;
  }

  #radio-view-toggle {
    background-color: #ffffff;
    border-radius: 6px;
    display: flex;
  }

  // ////////////////////////////////////////////////////////////// [FILTER PANEL]

  #project-filter-container {
    position: relative;
    margin-right: 12%;
    display: flex;
  }

  #filter-panel-wrapper {
    width: 0%;
    background-color: #ffffff;
    transition: width 500ms ease-in-out;
    overflow: visible;
    border-radius: 0px 6px 6px 0px;
  }

  .filter-panel {
    font-family: $fontInter;
    &.title {
      font-weight: 400;
      margin: 6px;
    }
    &.inner-wrapper {
      position: relative;
      width: 64%;
      margin-left: 36%;
      overflow: hidden;
    }
  }

  // ////////////////////////////////////////////////////////////// [PROJECT CARDS]

  #card-display {
    margin-left: 18%;
    margin-right: 4%;
    transition: all 500ms ease-in-out;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
  }

  .card-container {
    grid-column: 1;
    grid-row: 1;
    height: 250px;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .card {
    width: 100%;
    height: 64%;
    border-radius: 6px;
    background-color: #FFFFFF;
    margin-bottom: 16px;
  }

  .card:hover {
    cursor: pointer;
  }

  .card-logo {
    position: relative;
    width: 50%;
    height: 60%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
  }

  img {
    width: 100%;
    height: 100%;
  }

  label { font-weight: bold; }
  p { font-size: 10pt; }

  // /////////////////////////////////////////////////////////// [PAGINATION CONTROLS]

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
    border-radius: 6px;
    padding: 0.25rem 1.0rem;
  }

</style>
