<template>
  <div id="toolbar">

    <div class="filter-panel-controls">

      <Button
        id="filter-panel-toggle-button"
        type="C"
        :text="filterPanelToggleButtonLabel"
        :class="[filterButtonFloating, { 'active': filterPanelOpen }]"
        @clicked="toggleFilterPanel">
        <template #icon-before>
          <FiltersToggleIcon />
        </template>
      </Button>

      <Button
        v-if="selectedFiltersCount"
        id="clear-selected-filters-button"
        type="C"
        :text="clearSelectedFiltersButtonText"
        @clicked="clearSelectedFilters">
        <template #icon-after>
          <CloseIcon />
        </template>
      </Button>

    </div>

    <div class="radio-sort-wrapper">

      <SortBySelector
        class="sort-by-selector"
        :label="sortDropdownLabel"
        :sort-options="sortOptions"
        @changed="sortBySelectorChanged">
        <template #dropdown-icon>
          <SelectorToggleIcon />
        </template>
      </SortBySelector>

      <div
        id="list-block-toggle-button"
        :class="{ 'list-view-active': listViewActive }"
        @click="toggleListBlockView">
        <ListViewIcon class="list-view-icon" />
        <BlockViewIcon class="block-view-icon" />
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
import CloseIcon from '@/components/Icons/Close'
import ListViewIcon from '@/components/Icons/ListView'
import BlockViewIcon from '@/components/Icons/BlockView'
import SelectorToggleIcon from '@/modules/zero/core/Components/Icons/SelectorToggle'

// ====================================================================== Export
export default {
  name: 'Toolbar',

  components: {
    Button,
    SortBySelector,
    FiltersToggleIcon,
    CloseIcon,
    ListViewIcon,
    BlockViewIcon,
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
      routeQuery: 'filters/routeQuery',
      filterButtonFloating: 'global/filterButtonFloating'
    }),
    sortOptions () {
      return this.siteContent.taxonomy.sort
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
      this.$Countly.trackEvent('Clear Filters Button Clicked', {
        count: this.selectedFiltersCount
      })
      this.$emit('clearSelectedFilters')
    },
    sortBySelectorChanged (change) {
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
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
#toolbar {
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
  &.active {
    background-color: $tiber;
    color: white;
    .svg-icon {
      path {
        stroke: white;
      }
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
    margin-right: 1rem;
    @include mini {
      margin-bottom: 1rem;
    }
  }
}

::v-deep #list-block-toggle-button {
  @include borderRadius3;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 2.25rem;
  background-color: white;
  cursor: pointer;
  &:before {
    @include borderRadius3;
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    background-color: $tiber;
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
  @include borderRadius3;
  white-space: nowrap;
  padding: 0 1rem;
  z-index: 10;
}
</style>
