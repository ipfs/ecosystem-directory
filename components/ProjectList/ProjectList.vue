<template>
  <div id="card-display-wrapper">
    <div id="card-display">

      <Paginate
        v-if="ProjectList"
        v-slot="{ paginated }"
        :display="paginationDisplay"
        :collection="ProjectList"
        class="card-grid">
        <template v-for="(project, index) in paginated">
          <div
            v-if="paginated"
            :key="index"
            class="card-container"
            :style="`grid-column: ${index % 4 + 1}; grid-row: ${Math.ceil((1 + index) / 4)};`">

            <div class="card">
              <div class="card-logo">
                <img :src="logos(project.logo)" />
              </div>
            </div>

            <label>{{ project.name }}</label>

            <p>{{ project.description }}</p>
          </div>
        </template>
      </Paginate>

      <PaginationControls />

    </div>
  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Paginate from '@/modules/zero/pagination/Components/Paginate'
import PaginationControls from './PaginationControls'

import SampleProjects from '~/content/projects/sampleProjects.json'

// ===================================================================== Functions
const processProjects = (instance) => {
  instance.projects = SampleProjects.projects
}

// ====================================================================== Export
export default {
  name: 'ProjectList',

  components: {
    Paginate,
    PaginationControls
  },

  props: {
    paginationDisplay: {
      type: Number,
      required: false,
      default: 20
    }
  },

  data () {
    return {
      projects: false
    }
  },

  computed: {
    ...mapGetters({
      page: 'pagination/page',
      totalPages: 'pagination/totalPages'
    }),
    ProjectList () {
      const projects = this.projects
      // let filtered = rankings.filter((obj) => {
      //     const name = obj.name ? obj.name.toLowerCase() : ''
      //     const filter = this.filterValue.toLowerCase()
      //     if (name.includes(filter)) { return obj }
      //     return false
      //   })
      return projects
    }
  },

  mounted () {
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  h4 { font-weight: 400; }

  /* CARDS */

  #card-display-wrapper {
    min-width: 600px;
  }

  #card-display {
    margin: 0 5%;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22px;
    margin: 11px 11px;
    /* grid-auto-rows: minmax(100px, auto); */
  }

  .card-container {
    grid-column: 1;
    grid-row: 1;
    height: 250px;
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

</style>
