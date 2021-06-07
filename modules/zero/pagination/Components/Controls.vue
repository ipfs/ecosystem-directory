<template>
  <div v-if="totalPages > 1 && page <= totalPages" class="pagination-controls">

    <template v-if="page !== 1">
      <button
        class="control-button first"
        @click="navigateToPage(1)">

        <slot name="first-page"></slot>

      </button>
      <button
        class="control-button prev"
        @click="navigateToPage(page - 1)">

        <slot name="prev-page"></slot>

      </button>
      <div class="breaker">
        {{ breaker }}
      </div>
    </template>

    <button
      v-for="page in pages"
      :key="`page-${page.num}`"
      :class="['page-button', { current: page.current, display: page.display }]"
      :style="{ opacity: page.current ? 1.0 : 0.5 }"
      @click="navigateToPage(page.num)">
      {{ page.num }}
    </button>

    <template v-if="page !== totalPages">
      <div class="breaker">
        {{ breaker }}
      </div>
      <button
        class="control-button next"
        @click="navigateToPage(page + 1)">

        <slot name="next-page"></slot>

      </button>
      <button
        class="control-button last"
        @click="navigateToPage(totalPages)">

        <slot name="last-page"></slot>

      </button>

    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'Controls',

  props: {
    breaker: {
      type: String,
      required: false,
      default: '⋯'
    },
    first: {
      type: String,
      required: false,
      default: 'First'
    },
    prev: {
      type: String,
      required: false,
      default: 'Prev'
    },
    next: {
      type: String,
      required: false,
      default: 'Next'
    },
    last: {
      type: String,
      required: false,
      default: 'Last'
    }
  },

  computed: {
    ...mapGetters({
      page: 'pagination/page',
      totalPages: 'pagination/totalPages',
      display: 'pagination/display'
    }),
    pages () {
      const total = this.totalPages
      const current = this.page
      const buffer = 2
      const compiled = []
      for (let i = 0; i < total; i++) {
        compiled.push({
          num: i + 1,
          display: i >= current - buffer - 1 && i <= current + buffer - 1,
          current: i + 1 === current
        })
      }
      return compiled
    }
  },

  methods: {
    navigateToPage (page) {
      const cloned = CloneDeep(this.$route.query)
      if (page !== 1) {
        cloned.page = page
      } else {
        delete cloned.page
      }
      this.$router.push({ query: cloned })
    }
  }
}
</script>

<style lang="scss">

// ///////////////////////////////////////////////////////////////////// General
.pagination-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
}

// /////////////////////////////////////////////////////////// Buttons & Breaker
.page-button,
.breaker,
.control-button {
  padding: 0.5rem;
  margin-right: 0.25rem;
  margin-left: 0.25rem;
  color: $tiber;
  opacity: 0.5;
  font-weight: 600;
}

.page-button {
  display: none;
  &:not(.current) {
    &:hover {
      text-decoration: underline;
      opacity: 1.0;
    }
  }
  &.display {
    display: flex;
  }
  &.current {
    color: $tiber;
    cursor: default;
  }
}

.control-button {
  color: $tiber;
  &:hover {
    text-decoration: underline;
  }
  &.first,
  &.last {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
  &.prev,
  &.next {
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
