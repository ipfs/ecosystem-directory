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
      this.$router.push({
        query: { page }
      })
    }
  }
}
</script>

<style lang="scss">
$dimension: 2.5rem;

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
.breaker {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: $dimension;
  height: $dimension;
  color: grey;
}

.breaker {
  display: flex;
  // font-weight: 500;
  color: black;
  opacity: 0.25;
}

.page-button {
  // font-family: $fontInter;
  // font-weight: 600;
  display: none;
  &:not(.current) {
    &:hover {
      text-decoration: underline;
    }
  }
  &.display {
    display: flex;
  }
  &.current {
    color: black;
    cursor: default;
  }
}

.control-button {
  color: grey;
  padding: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
  &.first,
  &.prev {
    margin-right: 1rem;
  }
  &.next,
  &.last {
    margin-left: 1rem;
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
