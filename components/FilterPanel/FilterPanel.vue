<template>
  <Filters
    v-if="ProjectFilters"
    v-slot="{ filtered }"
    :headings="ProjectFilters"
    :filters="ProjectFilters"
    class="filter-panel-content">

    <h4 class="filter-panel title">
      All Filters
    </h4>

    <div id="filter-headings">
      <template v-for="(heading, index) in ProjectFilters">
        <div :key="heading.label" class="filter-category container">

          <div class="filter-category heading-wrapper" @click.stop="toggleCat(index)">

            <div class="filter-category heading">
              {{ heading.label }}
              <span class="filter-category number-active">
                (0 of {{ heading.tags.length }})
              </span>
            </div>

            <div class="filter-category toggle" :class="{ flip: !activeCats[index] }">
              <ToggleArrow stroke="#494949" />
            </div>

          </div>

          <div class="collapsible-tags" :class="{ expanded: activeCats[index], collapsed : !activeCats[index] }">

            <h5 class="filter-category sub-heading">
              Filter by {{ heading.label }}
            </h5>

            <div class="filter-category tag-list">
              <div v-for="tag in heading.tags" :key="tag.label" class="filter-category tag">
                {{ tag.label }}
              </div>
            </div>

          </div>

        </div>
      </template>
    </div>

  </Filters>
</template>

<script>
// ===================================================================== Imports
import Filters from '@/modules/zero/filters/Components/Filters'
import ToggleArrow from '@/components/Icons/ToggleArrow'

// ===================================================================== Functions

// ====================================================================== Export

export default {
  name: 'FilterPanel',

  components: {
    Filters,
    ToggleArrow
  },

  props: {
    categories: {
      type: [Boolean, Array],
      default: false,
      required: false
    }
  },

  data () {
    return {
      activeCats: []
    }
  },

  computed: {
    ProjectFilters () {
      const filters = this.categories
      return filters
    },
    initToggles () {
      const arr = Array(this.categories.length).fill(false)
      return arr
    }
  },

  mounted () {
    this.activeCats = this.initToggles
    console.log(this.activeCats)
  },

  methods: {
    toggleCat (ind) {
      this.$set(this.activeCats, ind, !this.activeCats[ind])
    }
  }
}

</script>

<style lang="scss" scoped>

  .filter-panel-content {
    margin-top: 2rem;
    margin-right: 2rem;
    white-space: nowrap;
  }

  .filter-category {
    &:hover {
      cursor: pointer;
    }
    &.heading-wrapper {
      display: flex;
      justify-content: space-between;
    }
    &.heading {
      font-family: $fontMontserrat;
      font-weight: bold;
      padding: 0.5rem 0rem;
      margin: 6px;
    }
    &.number-active {
      font-size: 8pt;
    }
    &.toggle {
      display: inline-block;
      padding: 0.5rem;
      margin: 6px;
      vertical-align: middle;
      height: 100%;
      position: relative;
      top: 0.5rem;
      opacity: 0.5;
      &:hover {
        opacity: 1.0;
      }
    }
    &.sub-heading {
      margin: 6px;
      margin-bottom: 1rem;
    }
    &.tag-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    &.tag {
      font-family: $fontInter;
      font-weight: bold;
      font-size: 8pt;
      padding: 0.5rem 1rem;
      max-width: 100%;
      background-color: $blackHaze;
      border-radius: 6px;
    }
    &.tag-list > .tag {
      margin: 6px;
    }
  }

  .flip {
    transform: scaleY(-1);
  }

  .collapsible-tags {
    transition: height 500ms ease-in-out;
    overflow: hidden;
    height: 0px;
  }

  .expanded {
    height: auto;
  }

</style>
