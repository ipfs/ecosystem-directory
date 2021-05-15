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
          <Filters
            class="filter-panel content">
            <h4>All Filters</h4>
          </Filters>
        </div>
      </div>

      <!-- Paginated List Component -->

      <div id="card-display" ref="cardDisplay">

        <Paginate
          v-if="ProjectList"
          v-slot="{ paginated }"
          :display="display"
          :collection="ProjectList">

          <div v-if="!listActive" class="grid paginate-cards">
            <div
              v-for="(project, index) in paginated"
              :key="`grid-${index}`"
              class="col-3 card-container-grid">

              <div class="card-grid">
                <div class="card-logo-grid">
                  <img :src="logos(project.logo)" />
                </div>
              </div>

              <label>{{ project.name }}</label>

              <p>{{ project.description }}</p>

            </div>
          </div>

          <div v-else>
            <div
              v-for="(project, index) in paginated"
              :key="`list-${index}`"
              class="col-3 card-container-list">

              <div class="card-list">
                <div class="card-logo-list">
                  <img :src="logos(project.logo)" />
                </div>
                <div class="card-project-list">
                  <label>{{ project.name }}</label>
                  <p>{{ project.description }}</p>
                </div>
              </div>

            </div>
          </div>

        </Paginate>

        <div class="page-navigation-controls">

          <PaginationControls />

          <div class="results-selector-wrapper">
            <ResultsPerPageSelector :collection="ProjectList" class="results-per-page font-inter">

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
import Filters from '@/modules/zero/filters/Components/Filters'
import PaginationControls from './PaginationControls'

import SampleProjects from '~/content/projects/sampleProjects.json'

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
    Filters
  },

  data () {
    return {
      projects: false,
      paginationDisplay: 20,
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
        this.$refs.filterWrap.style.width = '70%'
        this.$refs.cardDisplay.style.marginLeft = '5%'
        this.$refs.cardDisplay.style.marginRight = '12%'
      } else {
        this.$refs.filterWrap.style.width = '0%'
        this.$refs.cardDisplay.style.marginLeft = '16%'
        this.$refs.cardDisplay.style.marginRight = '16%'
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
      return require('~/assets/logos/' + path)
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

<style lang="scss" scoped>

  #project-view-container {
    width: 100%;
    min-width: 600px;
    padding: 0;
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
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
  }

  #filter-panel-wrapper {
    width: 0%;
    background-color: #ffffff;
    transition: width 500ms ease-in-out;
    flex-basis: content;
    overflow: hidden;
    border-radius: 0px 6px 6px 0px;
  }

  h4 { font-weight: 400; }

  .filter-panel {
    font-family: $fontInter;
    &.inner-wrapper {
      position: relative;
      width: 100%;
      margin-left: 36%;
      overflow: hidden;
    }
    &.content {
      margin-top: 2rem;
      white-space: nowrap;
    }
  }

  // ////////////////////////////////////////////////////////////// [PROJECT CARDS]

  #card-display {
    margin-left: 16%;
    margin-right: 16%;
    width: 84%;
    transition: all 500ms ease-in-out;
  }

  .paginate-cards {
    justify-content: flex-start;
    align-content: flex-start;
  }

  // ////////////////////////////////////////////////////////////// [GRID VIEW]

  .card-container-grid {
    height: 250px;
    margin-bottom: 1rem;
    display: inline-block;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 140px;
    & label { font-weight: bold; }
    & p { font-size: 10pt; }
  }

  .card-grid {
    width: 100%;
    height: 64%;
    border-radius: 6px;
    background-color: #FFFFFF;
    margin-bottom: 16px;
    &:hover {
      cursor: pointer;
    }
  }

  .card-logo-grid {
    position: relative;
    width: 50%;
    height: 60%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
  }

  // ////////////////////////////////////////////////////////////// [LIST VIEW]
  .card-container-list {
    display: inline-block;
    flex-grow: 1;
    flex-shrink: 1;
    // min-width: 350px;
    max-width: 500px;
    width: 50%;
    height: 120px;
    margin-bottom: 0;
  }

  .card-list {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-color: #FFFFFF;
    margin-bottom: 16px;
    display: flex;
    position: relative;
    &:hover {
      cursor: pointer;
    }
  }

  .card-logo-list {
    position: relative;
    padding: 1.0rem;
    margin-left: 0.5rem;
    width: 80px;
    max-height: 80%;
    top: 50%;
    transform: translateY(-50%);
  }

  .card-project-list {
    position: absolute;
    vertical-align: middle;
    padding: 1rem;
    margin-left: 5.0rem;
    vertical-align: middle;
    & label {
      font-size: 16pt;
      font-weight: bold;
    }
    & p {
      font-size: 10pt;
    }
  }

  img {
    width: 100%;
    height: 100%;
  }

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
