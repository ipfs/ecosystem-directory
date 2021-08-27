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
              <div
                tabindex="0"
                class="filter-category heading focus-visible">
                {{ heading.label }}
                <span class="filter-category number-active">
                  {{ numberInCategory[heading.slug] }} of {{ heading.tags.length }}
                </span>
                <button
                  v-if="includeClearCategory && (numberInCategory[heading.slug] > 0)"
                  class="granular-filter-clear focus-visible"
                  @click.stop="clearCategory(heading.slug)">
                  Clear
                </button>
                <h5 v-if="getSublabel(heading)" class="filter-category sub-heading">
                  {{ getSublabel(heading) }}
                </h5>
              </div>
              <div>
                <SelectorToggleIcon class="dropdown-toggle"/>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="filter-category chiclet-list">
                <div
                  v-if="includeFilterAllTag"
                  tabindex="0"
                  :class="['filter-category', 'tag', 'chiclet', 'focus-visible', { 'active-button': numberInCategory[heading.slug] === heading.tags.length }]"
                  @click="toggleAll(heading.slug)"
                  @keyup.enter="toggleAll(heading.slug)">
                  All
                </div>
                <div
                  v-for="(tag, j) in heading.tags"
                  :key="`taxonomy-category-${j}`"
                  tabindex="0"
                  :class="['filter-category', 'tag', 'chiclet', 'focus-visible', { 'active-button': selectedTags.includes(tag.slug) }]"
                  @click="applyFilter(tag.slug, heading.slug)"
                  @keyup.enter="applyFilter(tag.slug, heading.slug)">
                  {{ tag.label }}
                </div>
              </div>
            </AccordionContent>
          </AccordionSection>
        </template>
      </Accordion>

      <div id="filter-panel-controls" class="bottom-buttons">
        <button
          v-if="selectedTags.length"
          class="clear-selected-button focus-visible"
          @click="clearSelected">
          {{ clearSelectedFiltersButtonText }}
        </button>
        <button class="done-button focus-visible" @click="closePanel">
          {{ submitButtonText }}
        </button>
      </div>

    </div>
  </Filters>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Filters from '@/modules/zero/filters/Components/Filters'
import Accordion from '@/modules/zero/core/Components/Accordion/Accordion'
import AccordionHeader from '@/modules/zero/core/Components/Accordion/Header'
import AccordionSection from '@/modules/zero/core/Components/Accordion/Section'
import AccordionContent from '@/modules/zero/core/Components/Accordion/Content'
import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'

// =================================================================== Functions
const toggleAllCategoryTags = (instance, heading) => {
  const filters = instance.ProjectFilters
  filters.forEach((item) => {
    if (item.slug === heading) {
      const checker = []
      let state = 'on'
      for (let i = 0; i < item.tags.length; i++) {
        if (!instance.routeQuery.tags.includes(item.tags[i].slug)) {
          instance.setRouteQuery({ key: 'tags', data: item.tags[i].slug })
          checker.push(false)
        } else {
          checker.push(true)
        }
      }
      if (checker.every((val) => { return val })) {
        state = 'off'
        instance.clearRouteQueryTags(heading)
      }
      if (instance.$Countly) {
        instance.$Countly.trackEvent('Filter Chiclet Clicked', {
          tag: 'all',
          category: heading,
          state
        })
      }
    }
  })
}

// ====================================================================== Export

export default {
  name: 'ShipyardFilterPanel',

  components: {
    Filters,
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent,
    SelectorToggleIcon
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
      settings: 'global/settings',
      routeQuery: 'filters/routeQuery',
      categoryLookUp: 'filters/categoryLookUp',
      filterPanelOpen: 'filters/filterPanelOpen'
    }),
    includeFilterAllTag () {
      if (typeof this.settings.behavior.excludeFilterAllTag === 'boolean') {
        return !this.settings.behavior.excludeFilterAllTag
      }
      return true
    },
    includeClearCategory () {
      if (typeof this.settings.behavior.includeGranularFilterClearButton === 'boolean') {
        return this.settings.behavior.includeGranularFilterClearButton
      }
      return false
    },
    filterPanelContent () {
      return this.siteContent.index.page_content.section_filter.filter_panel
    },
    clearSelectedFiltersButtonText () {
      const clearButtonText = this.filterPanelContent.clear_button_text
      const count = this.selectedTags.length
      return `${clearButtonText.before}${count > 0 ? ` (${count}) ` : ' '}${clearButtonText.after}`
    },
    submitButtonText () {
      return this.filterPanelContent.submit_button_text
    },
    ProjectFilters () {
      return this.siteContent.taxonomy.categories
    },
    selectedTags () {
      if (this.routeQuery.tags) { return this.routeQuery.tags.split(',') }
      return []
    },
    numberInCategory () {
      const obj = {}
      const len = this.selectedTags.length
      this.ProjectFilters.forEach((category) => {
        let sum = 0
        for (let i = 0; i < len; i++) {
          if (this.categoryLookUp[category.slug].tags.includes(this.selectedTags[i])) { sum++ }
        }
        obj[category.slug] = sum
      })
      return obj
    }
  },

  methods: {
    ...mapActions({
      setRouteQuery: 'filters/setRouteQuery',
      clearRouteQueryTags: 'filters/clearRouteQueryTags',
      clearAllTags: 'filters/clearAllTags',
      setFilterValue: 'core/setFilterValue'
    }),
    getSublabel (heading) {
      if (!heading.hasOwnProperty('sublabel')) { return `Filter by ${heading.label}` }
      const sublabel = heading.sublabel
      if (typeof sublabel === 'string') { return sublabel }
      return false
    },
    applyFilter (tag, category) {
      if (this.$Countly) {
        this.$Countly.trackEvent('Filter Chiclet Clicked', {
          tag,
          category,
          state: this.routeQuery.tags.includes(tag) ? 'off' : 'on'
        })
      }
      this.setRouteQuery({ key: 'tags', data: tag })
    },
    toggleAll (heading) {
      toggleAllCategoryTags(this, heading)
    },
    clearCategory (heading) {
      this.clearRouteQueryTags(heading)
    },
    clearSelected () {
      this.clearAllTags()
      this.setFilterValue('')
    },
    closePanel () {
      this.$emit('toggleFilterPanel', 'done')
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

#filter-panel-controls {
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
  .clear-selected-button,
  .done-button {
    @include borderRadius_Medium;
    padding: 0.4rem 1.2rem;
    font-size: 10pt;
    margin: 0.5rem 1rem 0.5rem 0;
    transition: 250ms ease-out;
    &:hover {
      transition: 250ms ease-in;
    }
  }
  .clear-selected-button {
    margin-left: 0;
  }
  .done-button {
    font-weight: bold;
  }
}

// //////////////////////////////////////////////////////////////// Filter Panel
.filter-category {
  &.container {
    margin-bottom: 1rem;
  }
  &.heading-wrapper {
    display: flex;
    justify-content: space-between;
  }
  &.heading {
    font-weight: 500;
    margin: 0.125rem 0.375rem 1rem 0.375rem ;
    margin-bottom: 1rem;
  }
  &.number-active {
    font-size: 8pt;
    margin: 0 .75rem 0 0.35rem;
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
    white-space: normal;
    margin-right: 2rem;
  }
  &.chiclet-list {
    padding: 6px 0;
    margin: 0 6px;
  }
}

.granular-filter-clear {
  font-size: 7pt;
  margin: 0 0.125rem;
  text-decoration: underline transparent;
  transition: text-decoration-color 250ms ease-out;
  &:hover {
    transition: text-decoration-color 250ms ease-in;
    text-decoration-color: currentColor;
  }
}

.accordion-header {
  position: relative;
  cursor: pointer;
}

.accordion-section {
  .dropdown-toggle {
    transition: 250ms ease-in;
  }
  &.open {
    .accordion-header {
      .dropdown-toggle {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
