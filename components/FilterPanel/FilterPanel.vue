<template>
  <Filters
    v-if="ProjectFilters"
    id="filter-panel"
    :projects="collection"
    :filters="ProjectFilters"
    :selected="selectedLabels">
    <div id="filter-accordion">

      <Accordion
        v-slot="{ active }"
        :multiple="true">
        <template v-for="(heading, i) in ProjectFilters">
          <AccordionSection
            :key="`taxonomy-category-${i}`"
            :active="active"
            :selected="true"
            class="filter-category container">
            <AccordionHeader class="filter-category heading-wrapper">
              <div class="filter-category heading">
                {{ heading.label }}
                <span class="filter-category number-active">
                  {{ allSelected[i] }} of {{ heading.tags.length }}
                </span>
                <h5 class="filter-category sub-heading">
                  Filter by {{ heading.label }}
                </h5>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="filter-category chiclet-list">
                <div
                  :class="['filter-category tag chiclet', { 'active-button': allSelected[i] === heading.tags.length }]"
                  @click="toggleAll(i, heading.label)">
                  All
                </div>
                <div
                  v-for="(tag, j) in heading.tags"
                  :key="`taxonomy-category-${j}`"
                  :class="['filter-category tag chiclet', { 'active-button': selected.includes(tag) }]"
                  @click="applyFilter(tag, i, heading.label)">
                  {{ tag.label }}
                </div>
              </div>
            </AccordionContent>
          </AccordionSection>
        </template>
      </Accordion>

      <div id="filter-panel-controls" class="bottom-buttons">
        <button
          v-if="selected.length"
          class="clear-selected"
          @click="clearSelected">
          {{ clearSelectedFiltersButtonText }}
        </button>
        <button class="done" @click="closePanel">
          {{ submitButtonText }}
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
import Accordion from '@/modules/zero/core/Components/Accordion/Accordion'
import AccordionHeader from '@/modules/zero/core/Components/Accordion/Header'
import AccordionSection from '@/modules/zero/core/Components/Accordion/Section'
import AccordionContent from '@/modules/zero/core/Components/Accordion/Content'

import Taxonomy from '@/content/data/taxonomy.json'

// =================================================================== Functions
const appendFilters2URL = (instance) => {
  let slug = ''
  const len = instance.selected.length
  for (let i = 0; i < len; i++) {
    const delimiter = i === len - 1 ? '' : ','
    slug = slug + instance.selected[i].slug + delimiter
  }
  instance.setRouteQuery({
    key: 'tags',
    data: slug
  })
}

const applyFiltersFromURL = (instance) => {
  const cloned = instance.resetCategories()
  const qry = instance.$route.query.tags.split(',')
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
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent
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
      selected: []
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      routeQuery: 'global/routeQuery',
      activeTags: 'filters/activeTags',
      filterPanelOpen: 'filters/filterPanelOpen'
    }),
    filterPanelContent () {
      return this.siteContent.index.page_content.section_filter.filter_panel
    },
    clearSelectedFiltersButtonText () {
      const clearButtonText = this.filterPanelContent.clear_button_text
      const count = this.selected.length
      return `${clearButtonText.before}${count > 0 ? ` (${count}) ` : ' '}${clearButtonText.after}`
    },
    submitButtonText () {
      return this.filterPanelContent.submit_button_text
    },
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
    if (this.$route.query.filters === 'enabled' && this.$route.query.tags) {
      applyFiltersFromURL(this)
    } else {
      this.setActiveTags(this.resetCategories())
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'global/setRouteQuery',
      setActiveTags: 'filters/setActiveTags',
      setSelectedFiltersCount: 'filters/setSelectedFiltersCount'
    }),
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
    margin-bottom: 1rem;
  }
  &:hover {
    cursor: pointer;
  }
  &.heading-wrapper {
    display: flex;
    justify-content: space-between;
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
    margin-bottom: 1rem;
  }
  &.chiclet-list {
    padding: 6px 0;
    margin: 0 6px;
  }
}

.accordion-header {
  position: relative;
  cursor: pointer;
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0.3125rem;
    width: 0.75rem;
    height: 100%;
    background: url('~assets/theme/svgs/chevrondown.svg') no-repeat right center;
  }
}

.accordion-section {
  &.open {
    .accordion-header {
      &:after {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
