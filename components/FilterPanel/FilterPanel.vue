<template>
  <Filters
    v-if="ProjectFilters"
    :projects="collection"
    :filters="ProjectFilters"
    :selected="selectedLabels"
    class="filter-panel-content">

    <template v-if="isActive">
      <div id="filter-headings">
        <template v-for="(heading, index) in ProjectFilters">
          <div :key="heading.label" class="filter-category container">

            <div class="filter-category heading-wrapper" @click.stop="toggleCat(index)">

              <div class="filter-category heading">

                {{ heading.label }}

                <span v-if="count.length" class="filter-category number-active">
                  ({{ count[index] }} of {{ heading.tags.length }})
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
                  :class="`filter-category tag ${allApplied[index] ? 'active-button' : 'not-selected'}`"
                  @click="toggleAll(index)">
                  All
                </div>

                <div
                  v-for="tag in heading.tags"
                  :key="tag.label"
                  :class="`filter-category tag ${selected.includes(tag) ? 'active-button' : 'not-selected'}`"
                  @click="applyFilter(tag, index)">
                  {{ tag.label }}
                </div>

              </div>

            </div>

          </div>
        </template>

        <div class="bottom-buttons">

          <button
            v-if="selected.length"
            class="clear-selected"
            @click="clearSelected">
            Clear ({{ selected.length }}) Selected
          </button>

          <button
            class="done"
            @click="closePanel">
            Done
          </button>

        </div>
      </div>
    </template>

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

const appendFilters2URL = (instance) => {
  let slug = ''
  const len = instance.selected.length
  for (let i = 0; i < len; i++) {
    const delimiter = i === len - 1 ? '' : ','
    slug = slug + instance.selected[i].slug + delimiter
  }

  if (slug) {
    instance.$router.replace({ query: { filters: 'enabled', tag: slug } })
  } else {
    instance.$router.replace({ query: { filters: 'enabled' } })
  }
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
    },
    isActive: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data () {
    return {
      catsActive: [],
      allApplied: [],
      count: [],
      selected: [],
      heights: []
    }
  },

  computed: {
    ProjectFilters () {
      const filters = Taxonomy.categories
      return filters
    },
    initToggles () {
      const arr = Array(Taxonomy.categories.length).fill(true)
      return arr
    },
    selectedLabels () {
      const arr = []
      for (let i = 0; i < this.selected.length; i++) {
        arr.push(this.selected[i].slug)
      }
      return arr
    }
  },

  watch: {
    selected () {
      this.$emit('totalSelected', this.selected.length)
    }
  },

  mounted () {
    this.catsActive = this.initToggles
    for (let i = 0; i < this.ProjectFilters.length; i++) {
      this.count.push(0)
      this.allApplied.push(false)
    }

    let slugs
    if (this.$route.query.filters === 'enabled' && this.$route.query.tag) {
      const qry = this.$route.query.tag.split(',')
      slugs = qry.filter(Boolean)

      const arr = []
      for (let i = 0; i < this.ProjectFilters.length; i++) {
        for (let j = 0; j < this.ProjectFilters[i].tags.length; j++) {
          if (slugs.includes(this.ProjectFilters[i].tags[j].slug)) {
            arr.push(this.ProjectFilters[i].tags[j])
            this.count[i] += 1
            this.catsActive[i] = true
          }
        }
      }

      this.selected = arr
    }
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
    applyFilter (tag, ind) {
      if (this.selected.includes(tag)) {
        this.selected = this.selected.filter(item => item !== tag)
        this.count[ind] -= 1
        this.allApplied[ind] = false
      } else {
        this.selected.push(tag)
        this.count[ind] += 1
      }
      appendFilters2URL(this)
    },
    toggleAll (ind) {
      this.allApplied[ind] = !this.allApplied[ind]
      const filters = this.ProjectFilters
      if (this.allApplied[ind]) {
        for (let i = 0; i < filters[ind].tags.length; i++) {
          if (!this.selected.includes(filters[ind].tags[i])) {
            this.selected.push(filters[ind].tags[i])
            this.count[ind] += 1
          }
        }
      }
      appendFilters2URL(this)
    },
    clearSelected () {
      for (let i = 0; i < this.ProjectFilters.length; i++) {
        this.allApplied[i] = false
        this.count[i] = 0
      }
      this.selected = []
      appendFilters2URL(this)
    },
    closePanel () {
      this.$emit('closeFilters')
    }
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.filter-panel-content {
  margin-right: 2.5rem;
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

.bottom-buttons{
  margin-top: 2rem;
  margin-bottom: 4rem;
  font-family: $fontMontserrat;
  .clear-selected,
  .done {
    padding: 0.4rem 1.2rem;
    @include borderRadius3;
    font-size: 10pt;
  }
  .clear-selected {
    background-color: $blackHaze;
    color: $tiber;
    margin-right: 1rem;
  }
  .done {
    background-color: $tiber;
    color: white;
    font-weight: bold;
  }
}

// //////////////////////////////////////////////////////////////// Filter Panel
.filter-category {
  &:hover {
    cursor: pointer;
  }
  &.heading-wrapper {
    display: flex;
    justify-content: space-between;
    // line-height: 2.0;
    margin-top: 1rem;
  }
  &.heading {
    font-family: $fontMontserrat;
    font-weight: 500;
    // padding: 0.5rem 0rem;

    margin: 0 6px;
  }
  &.number-active {
    font-size: 8pt;
  }
  &.toggle {
    display: inline-block;
    // padding: 0.5rem;
    // margin: 6px;
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
    margin-bottom: 2rem;
  }
  &.tag-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }
  &.tag {
    font-family: $fontInter;
    font-weight: 500;
    font-size: 9pt;
    padding: 0.3rem 1.2rem;
    max-width: 100%;
    @include borderRadius3;
  }
  &.tag-list > .tag {
    margin: 5px;
  }
}

</style>
