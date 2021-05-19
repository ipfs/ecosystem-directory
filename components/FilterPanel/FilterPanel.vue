<template>
  <Filters
    v-if="ProjectFilters"
    v-slot="{ filtered }"
    :projects="collection"
    :filters="ProjectFilters"
    :selected="selected"
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

            <div class="filter-category toggle" :class="{ flip: !catsActive[index] }">
              <ToggleArrow stroke="#494949" />
            </div>

          </div>

          <div ref="cats" class="collapsible-tags" :class="{ collapsed : !catsActive[index] }">

            <h5 class="filter-category sub-heading">
              Filter by {{ heading.label }}
            </h5>

            <div class="filter-category tag-list">
              <div
                v-for="tag in heading.tags"
                :key="tag.label"
                :class="`filter-category tag ${selected.includes(tag.label) ? 'active-button' : 'not-selected'}`"
                @click="applyFilter(tag.label)">
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

import Taxonomy from '~/content/data/taxonomy.json'
// ===================================================================== Functions
const elementEnter = (element) => {
  const width = getComputedStyle(element).width

  element.style.width = width
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = 'auto'

  const height = getComputedStyle(element).height

  element.style.width = null
  element.style.position = null
  element.style.visibility = null
  element.style.height = 0

  requestAnimationFrame(() => {
    element.style.height = height
    setTimeout(() => { element.style.height = 'auto' }, 500)
  })
}

const elementLeave = (element) => {
  const height = getComputedStyle(element).height

  element.style.height = height

  requestAnimationFrame(() => {
    element.style.height = 0
  })
}
// ====================================================================== Export

export default {
  name: 'FilterPanel',

  components: {
    Filters,
    ToggleArrow
  },

  props: {
    collection: {
      type: [Boolean, Array],
      default: false,
      required: false
    }
  },

  data () {
    return {
      catsActive: [],
      heights: [],
      selected: []
    }
  },

  computed: {
    ProjectFilters () {
      const filters = Taxonomy.categories
      return filters
    },
    initToggles () {
      const arr = Array(Taxonomy.categories.length).fill(false)
      return arr
    }
  },

  mounted () {
    this.catsActive = this.initToggles
  },

  methods: {
    toggleCat (ind) {
      this.$set(this.catsActive, ind, !this.catsActive[ind])

      if (this.catsActive[ind]) {
        elementEnter(this.$refs.cats[ind])
      } else {
        elementLeave(this.$refs.cats[ind])
      }
    },
    applyFilter (tag) {
      if (this.selected.includes(tag)) {
        this.selected = this.selected.filter(item => item !== tag)
      } else {
        this.selected.push(tag)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
  .filter-panel-content {
    margin-top: 2rem;
    margin-right: 2rem;
    white-space: nowrap;
  }

  .flip {
    transform: scaleY(-1);
  }

  .collapsible-tags {
    transition: height 500ms ease-in-out;
    overflow: hidden;
  }

  .collapsed {
    height: 0px;
  }

  .active-button {
    background-color: $tiber;
    color: #ffffff;
  }

  .not-selected {
    background-color: $blackHaze;
  }

// //////////////////////////////////////////////////////////////// Filter Panel
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
      border-radius: 6px;
    }
    &.tag-list > .tag {
      margin: 6px;
    }
  }

</style>
