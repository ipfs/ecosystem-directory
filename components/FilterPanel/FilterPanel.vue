<template>
  <Filters
    v-if="ProjectFilters"
    id="filter-panel"
    :projects="collection"
    :filters="ProjectFilters"
    :selected="selectedTags">
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
                  {{ numberInCategory[heading.slug] }} of {{ heading.tags.length }}
                </span>
                <h5 class="filter-category sub-heading">
                  Filter by {{ heading.label }}
                </h5>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="filter-category chiclet-list">
                <div
                  :class="['filter-category tag chiclet', { 'active-button': numberInCategory[heading.slug] === heading.tags.length }]"
                  @click="toggleAll(heading.slug)">
                  All
                </div>
                <div
                  v-for="(tag, j) in heading.tags"
                  :key="`taxonomy-category-${j}`"
                  :class="['filter-category tag chiclet', { 'active-button': selectedTags.includes(tag.slug) }]"
                  @click="applyFilter(tag.slug, heading.slug)">
                  {{ tag.label }}
                </div>
              </div>
            </AccordionContent>
          </AccordionSection>
        </template>
      </Accordion>

      <div id="filter-panel-controls" class="bottom-buttons">
        <button
          v-if="selectedFiltersCount"
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
const toggleAllCategoryTags = (instance, heading) => {
  const filters = instance.ProjectFilters

  filters.forEach((item) => {
    if (item.slug === heading) {
      const checker = []
      for (let i = 0; i < item.tags.length; i++) {
        if (!instance.activeTags[heading].tags.includes(item.tags[i].slug)) {
          const category = heading
          const tag = item.tags[i].slug
          instance.setActiveTags({ category, tag })
          checker.push(false)
        } else {
          checker.push(true)
        }
      }
      if (checker.every((val) => { return val })) {
        instance.clearActiveTags(heading)
      }
    }
  })
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

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      activeTags: 'filters/activeTags',
      routeQuery: 'global/routeQuery'
    }),
    filterPanelContent () {
      return this.siteContent.index.page_content.section_filter.filter_panel
    },
    clearSelectedFiltersButtonText () {
      const clearButtonText = this.filterPanelContent.clear_button_text
      const count = this.selectedFiltersCount
      return `${clearButtonText.before}${count > 0 ? ` (${count}) ` : ' '}${clearButtonText.after}`
    },
    submitButtonText () {
      return this.filterPanelContent.submit_button_text
    },
    ProjectFilters () {
      return Taxonomy.categories
    },
    selectedTags () {
      const arr = []
      const cloned = CloneDeep(this.activeTags)
      Object.keys(cloned).forEach((category) => {
        if (cloned[category].tags.length) {
          const len = cloned[category].tags.length
          for (let i = 0; i < len; i++) { arr.push(cloned[category].tags[i]) }
        }
      })
      return arr
    },
    numberInCategory () {
      const obj = {}
      const cloned = CloneDeep(this.activeTags)
      Object.keys(cloned).forEach((category) => {
        const key = cloned[category].slug
        const val = cloned[category].tags.length
        obj[key] = val
      })
      return obj
    },
    selectedFiltersCount () {
      let count = 0
      Object.keys(this.activeTags).forEach((category) => {
        count += this.activeTags[category].tags.length
      })
      return count
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'global/setRouteQuery',
      setActiveTags: 'filters/setActiveTags',
      clearActiveTags: 'filters/clearActiveTags',
      setSelectedFiltersCount: 'filters/setSelectedFiltersCount',
      clearStore: 'filters/clearStore'
    }),
    applyFilter (tag, category) {
      this.setActiveTags({ category, tag })
    },
    toggleAll (heading) {
      toggleAllCategoryTags(this, heading)
    },
    clearSelected () {
      this.clearStore()
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
