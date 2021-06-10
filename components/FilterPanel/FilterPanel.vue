<template>
  <Filters
    v-if="ProjectFilters"
    id="filter-panel"
    :projects="collection"
    :filters="ProjectFilters"
    :selected="selectedLabels">
    <div id="filter-accordion">

      <template v-for="(heading, index) in ProjectFilters">
        <div :key="heading.label" class="filter-category container">

          <div class="filter-category heading-wrapper" @click.stop="toggleCat(index)">

            <div class="filter-category heading">
              {{ heading.label }}
              <span class="filter-category number-active">
                {{ allSelected[index] }} of {{ heading.tags.length }}
              </span>
            </div>

            <div class="filter-category toggle" :class="{ flip: !catsOpen[index] }">
              <ToggleArrow stroke="#494949" />
            </div>

          </div>

          <div ref="cats" class="collapsible-tags" :class="{ collapsed : !catsOpen[index] }">

            <h5 class="filter-category sub-heading">
              Filter by {{ heading.label }}
            </h5>

            <div class="filter-category chiclet-list">

              <div
                :class="['filter-category tag chiclet', { 'active-button': allSelected[index] === heading.tags.length }]"
                @click="toggleAll(index, heading.label)">
                All
              </div>

              <div
                v-for="tag in heading.tags"
                :key="tag.label"
                :class="['filter-category tag chiclet', { 'active-button': selected.includes(tag) }]"
                @click="applyFilter(tag, index, heading.label)">
                {{ tag.label }}
              </div>

            </div>

          </div>

        </div>
      </template>

      <div id="filter-panel-controls" class="bottom-buttons">
        <button
          v-if="selected.length"
          class="clear-selected"
          @click="clearSelected">
          Clear ({{ selected.length }}) Selected
        </button>
        <button class="done" @click="closePanel">
          Done
        </button>
      </div>

    </div>
  </Filters>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import Filters from '@/modules/zero/filters/Components/Filters'
import ToggleArrow from '@/components/Icons/ToggleArrow'

import Taxonomy from '@/content/data/taxonomy.json'

// =================================================================== Functions
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

const appendFilters2URL = (instance) => {
  let slug = ''
  const len = instance.selected.length
  for (let i = 0; i < len; i++) {
    const delimiter = i === len - 1 ? '' : ','
    slug = slug + instance.selected[i].slug + delimiter
  }
  const cloned = CloneDeep(instance.$route.query)
  if (slug) {
    cloned.tags = slug
  } else {
    delete cloned.tags
  }
  setTimeout(() => { instance.$router.push({ query: cloned }) }, 10)
}

const applyFiltersFromURL = (instance) => {
  const cloned = instance.resetCategories()
  const qry = instance.$route.query.tag.split(',')
  const slugs = qry.filter(Boolean)

  const arr = []
  const len = instance.ProjectFilters.length
  for (let i = 0; i < len; i++) {
    const category = instance.ProjectFilters[i]
    for (let j = 0; j < category.tags.length; j++) {
      if (slugs.includes(category.tags[j].slug)) {
        arr.push(category.tags[j])
        cloned[category.label].push(category.tags[j].label)
      }
    }
  }

  instance.setActiveTags(cloned)
  instance.selected = arr
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
      catsOpen: [],
      selected: [],
      heights: []
    }
  },

  computed: {
    ...mapGetters({
      activeTags: 'filters/activeTags'
    }),
    ProjectFilters () {
      return Taxonomy.categories
    },
    initToggles () {
      return Array(Taxonomy.categories.length).fill(true)
    },
    selectedLabels () {
      const arr = []
      for (let i = 0; i < this.selected.length; i++) {
        arr.push(this.selected[i].slug)
      }
      return arr
    },
    allSelected () {
      const arr = []
      const len = this.ProjectFilters.length
      for (let i = 0; i < len; i++) {
        if (this.activeTags.hasOwnProperty(this.ProjectFilters[i].label)) {
          arr.push(this.activeTags[this.ProjectFilters[i].label].length)
        } else {
          arr.push(0)
        }
      }
      return arr
    }
  },

  watch: {
    selected () {
      this.setSelectedFiltersCount(this.selected.length)
    }
  },

  mounted () {
    if (this.$route.query.filters === 'enabled' && this.$route.query.tag) {
      applyFiltersFromURL(this)
    } else {
      this.setActiveTags(this.resetCategories())
    }
    this.catsOpen = this.initToggles
  },

  methods: {
    ...mapActions({
      setActiveTags: 'filters/setActiveTags',
      setSelectedFiltersCount: 'filters/setSelectedFiltersCount'
    }),
    toggleCat (ind) {
      this.$set(this.catsOpen, ind, !this.catsOpen[ind])

      if (this.catsOpen[ind]) {
        elementEnter(this.$refs.cats[ind])
      } else {
        elementLeave(this.$refs.cats[ind])
      }
    },
    applyFilter (tag, ind, heading) {
      const cloned = CloneDeep(this.activeTags)

      if (cloned) {
        if (cloned.hasOwnProperty(heading)) {
          if (cloned[heading].includes(tag.label)) {
            cloned[heading] = cloned[heading].filter(item => item !== tag.label)
          } else {
            cloned[heading].push(tag.label)
          }
        }
        this.setActiveTags(cloned)
      } else {
        this.setActiveTags(this.resetCategories())
      }

      if (this.selected.includes(tag)) {
        this.selected = this.selected.filter(item => item !== tag)
      } else {
        this.selected.push(tag)
      }

      appendFilters2URL(this)
    },
    toggleAll (ind, heading) {
      const filters = this.ProjectFilters
      const cloned = CloneDeep(this.activeTags)

      if (cloned.hasOwnProperty(heading)) {
        for (let i = 0; i < filters.length; i++) {
          if (filters[i].label === heading) {
            const tags = filters[i].tags

            if (cloned[heading].length === filters[i].tags.length) {
              cloned[heading] = []
            } else {
              for (let j = 0; j < tags.length; j++) {
                if (!cloned[heading].includes(tags[j].label)) {
                  cloned[heading].push(tags[j].label)
                }
              }
            }

            this.setActiveTags(cloned)
          }
        }
      } else {
        this.setActiveTags(this.resetCategories())
      }

      const checker = []
      for (let i = 0; i < filters[ind].tags.length; i++) {
        if (!this.selected.includes(filters[ind].tags[i])) {
          this.selected.push(filters[ind].tags[i])
          checker.push(false)
        } else {
          checker.push(true)
        }
      }
      const success = checker.every((val) => { return val })
      if (success) {
        for (let i = 0; i < filters[ind].tags.length; i++) {
          const tag = filters[ind].tags[i]
          if (this.selected.includes(tag)) {
            this.selected = this.selected.filter(item => item !== tag)
          }
        }
      }

      appendFilters2URL(this)
    },
    clearSelected () {
      this.selected = []
      this.setActiveTags(this.resetCategories())
      appendFilters2URL(this)
    },
    resetCategories () {
      const cats = {}
      for (let i = 0; i < this.ProjectFilters.length; i++) {
        const name = this.ProjectFilters[i].label
        cats[name] = []
      }
      return cats
    },
    closePanel () {
      this.$emit('toggleFilterPanel')
    }
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#filter-panel {
  white-space: nowrap;
  @include tiny {
    margin: 0;
  }
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

#filter-panel-controls {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
  font-family: $fontMontserrat;
  .clear-selected,
  .done {
    @include borderRadius3;
    padding: 0.4rem 1.2rem;
    font-size: 10pt;
    margin: 0.5rem 1rem 0.5rem 0;
  }
  .clear-selected {
    background-color: $blackHaze;
    color: $tiber;
    margin-left: 0;
  }
  .done {
    background-color: $tiber;
    color: white;
    font-weight: bold;
  }
}

// //////////////////////////////////////////////////////////////// Filter Panel
.filter-category {
  &.container {
    margin-bottom: 3rem;
  }
  &:hover {
    cursor: pointer;
  }
  &.heading-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  &.heading {
    font-family: $fontMontserrat;
    font-weight: 500;
    margin: 0 6px;
  }
  &.number-active {
    font-size: 8pt;
  }
  &.toggle {
    display: inline-block;
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
    font-family: $fontInter;
    margin: 6px;
    margin-bottom: 3rem;
  }
  &.chiclet-list {
    margin: 0 6px;
  }
}
</style>
