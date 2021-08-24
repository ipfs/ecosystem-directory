<template>
  <div id="project-explorer-toolbar">

    <div class="filter-panel-controls">

      <Button
        id="filter-panel-toggle-button"
        type="C"
        :text="filterPanelToggleButtonLabel"
        :class="['focus-visible', filterButtonFloating, { 'active': filterPanelOpen }]"
        @clicked="toggleFilterPanel">
        <template #icon-before>
          <FiltersToggleIcon />
        </template>
      </Button>

      <Button
        v-if="selectedFiltersCount"
        id="clear-selected-filters-button"
        class="focus-visible"
        type="C"
        :text="clearSelectedFiltersButtonText"
        @clicked="clearSelectedFilters">
        <template #icon-after>
          <Shipyard_CloseIcon />
        </template>
      </Button>

    </div>

    <div class="radio-sort-wrapper">

      <SortBySelector
        v-if="showSortBySelector"
        class="sort-by-selector"
        :label="sortDropdownLabel"
        :sort-options="sortOptions"
        :default-sort="defaultSort"
        @changed="sortBySelectorChanged">
        <template #dropdown-icon>
          <SelectorToggleIcon />
        </template>
      </SortBySelector>

      <div
        v-if="showViewToggleButton"
        id="list-block-toggle-button"
        tabindex="0"
        :class="[{ 'list-view-active': listViewActive }, 'focus-visible']"
        @click="toggleListBlockView"
        @keyup.enter="toggleListBlockView">
        <Shipyard_ListViewIcon class="list-view-icon" />
        <Shipyard_BlockViewIcon class="block-view-icon" />
      </div>

    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Button from '@/modules/zero/core/Components/Button'
import SortBySelector from '@/modules/zero/filters/Components/SortBySelector'
import FiltersToggleIcon from '@/modules/zero/core/Components/Icons/FiltersToggle'
import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'

// ====================================================================== Export
export default {
  name: 'ShipyardProjectExplorerToolbar',

  components: {
    Button,
    SortBySelector,
    FiltersToggleIcon,
    SelectorToggleIcon
  },

  props: {
    filterPanelOpen: {
      type: Boolean,
      default: false,
      required: false
    },
    listViewActive: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent',
      settings: 'global/settings',
      routeQuery: 'filters/routeQuery',
      filterButtonFloating: 'global/filterButtonFloating'
    }),
    sortOptions () {
      return this.siteContent.taxonomy.sort
    },
    defaultSort () {
      return this.settings.visibility.setSort
    },
    sectionFilterContent () {
      return this.siteContent.index.page_content.section_filter
    },
    filterPanelToggleButtonLabel () {
      return this.sectionFilterContent.filter_panel_toggle_button_label
    },
    sortDropdownLabel () {
      return this.sectionFilterContent.sort_dropdown_label
    },
    clearSelectedFiltersButtonText () {
      const clearButtonText = this.sectionFilterContent.filter_panel.clear_button_text
      const count = this.selectedFiltersCount
      return `${clearButtonText.before}${count > 0 ? ` (${count}) ` : ' '}${clearButtonText.after}`
    },
    selectedFiltersCount () {
      if (this.routeQuery.tags) { return this.routeQuery.tags.split(',').length }
      return 0
    },
    showViewToggleButton () {
      if (this.settings.visibility.hideNonDefaultView) { return false }
      return true
    },
    showSortBySelector () {
      if (this.settings.visibility.hideSort) { return false }
      return true
    }
  },

  methods: {
    toggleFilterPanel () {
      this.$emit('toggleFilterPanel', 'filters')
    },
    toggleListBlockView () {
      this.$emit('toggleListBlockView')
    },
    clearSelectedFilters () {
      if (this.$Countly) {
        this.$Countly.trackEvent('Clear Filters Button Clicked', {
          count: this.selectedFiltersCount
        })
      }
      this.$emit('clearSelectedFilters')
    },
    sortBySelectorChanged (change) {
      if (this.$Countly) {
        const event = change.event
        const data = change.data
        if (event === 'toggleDropdown') {
          this.$Countly.trackEvent('Sort-By Dropdown Toggled', data)
        } else if (event === 'optionSelected') {
          this.$Countly.trackEvent('Sort-By Option Selected', data)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#project-explorer-toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  @include containerMaxMQ {
    padding: 0;
  }
  @include mini {
    flex-direction: column;
  }
}

// //////////////////////////////////////////////// [Button] Filter panel toggle
::v-deep #filter-panel-toggle-button {
  filter: drop-shadow(0 0 0.3rem rgba(73, 73, 73, 0.2));
  transition: bottom 0ms;
  @include small {
    left: 4.1665vw;
  }
  &.top {
    @include small {
      position: absolute;
      top: 3rem;
      z-index: 100;
    }
    @include mini {
      bottom: calc(4.1665vw + 84px + 0.5rem);
    }
  }
  &.bottom {
    @include small {
      position: absolute;
      bottom: 2rem;
      z-index: 100;
    }
    @include mini {
      bottom: calc(4.1665vw + 84px + 0.5rem);
    }
  }
  &.middle {
    @include small {
      position: fixed;
      bottom: 4.1665vw;
      z-index: 10;
    }
  }
}

// ///////////////////////////////////////////// [Button] Clear selected filters
#clear-selected-filters-button {
  margin-left: 0.5rem;
  @include mini {
    margin-bottom: 1rem;
  }
}

// ///////////////////////////////////////////////////////////// [Dropdown] Sort
.radio-sort-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @include mini {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sort-by-selector {
    position: relative;
    @include mini {
      margin-bottom: 1rem;
    }
  }
}

::v-deep #list-block-toggle-button {
  @include borderRadius_Medium;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1rem;
  position: relative;
  height: 2.25rem;
  background-color: white;
  cursor: pointer;
  &:before {
    @include borderRadius_Medium;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    transition: 300ms cubic-bezier(0.61, 1.6, 0.64, 0.88);
    z-index: 5;
  }
  &:not(.list-view-active) {
    .block-view-icon {
      g {
        stroke: white;
      }
    }
  }
  &.list-view-active {
    &:before {
      transform: translateX(-100%);
    }
    .list-view-icon {
      line {
        stroke: white;
      }
    }
  }
}

.list-view-icon,
.block-view-icon {
  @include borderRadius_Medium;
  white-space: nowrap;
  padding: 0 1rem;
  z-index: 10;
}
</style>
