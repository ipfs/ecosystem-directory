const ecodir_host = 'INJECT_SETTINGS_HOST'
const ecodir_targetEl = 'INJECT_SETTINGS_TARGET'
const ecodir_theme = 'light'

const ecodir_projects = INJECT_PROJECTS_LIST

const ecodir_filters = INJECT_FILTERS

const ecodir_responsive_sizes = {
  large: 1024,
  medium: 640,
  small: 415
}

if (typeof Vue !== 'undefined') {
  const version = Vue.version
  if (version && version.split('.')[0] < 3) ecodir_vueLoaded()
  else ecodir_unsupportedVueVersion()
} else {
  ecodir_loadVue()
}

function ecodir_loadCSS(callback) {
  const ecodir_css = document.createElement('style')
  ecodir_css.innerHTML = `INJECT_PROJECTS_STYLES`
  ecodir_css.addEventListener('load', callback)
  document.head.appendChild(ecodir_css)
}

function ecodir_loadVue() {
  INJECT_VUE_SCRIPT
  ecodir_vueLoaded()
}

function ecodir_vueLoaded(e) {
  if (!ecodir_projects || !ecodir_filters) return ecodir_unsupportedVueVersion()

  window.addEventListener('DOMContentLoaded', event => {
    ecodir_loadCSS(() => {
      document.querySelectorAll(`${ecodir_targetEl}`)
        .forEach(el => ecodir_initDirectory(el))
    })
  })
}

function ecodir_unsupportedVueVersion() {
  document.querySelectorAll(`${ecodir_targetEl}`).forEach(el => {
    const blockSectionsHTML = count => new Array(count).fill(0).map(() => `<div class="ecodir_error-block-section"></div>`).join('')

    el.innerHTML = `
    <div class="ecodir_error-unsupported">
      ${blockSectionsHTML(6)}
      <h2 class="ecodir_error-heading">Unsupported Vue version</h2>
      ${blockSectionsHTML(7)}
    </div>
    `
  })
  console.error('Unsupported Vue version')
}

function ecodir_initDirectory(el) {
  const ecodir_theme = el.dataset.theme || ecodir_theme
  const ecodir_parentElement = el.parentElement
  const ecodir_responsive_keys = Object.keys(ecodir_responsive_sizes)

  const ecodir_updateElementClasses = function (el) {
    const ecodir_parentContainerWidth = ecodir_parentElement.clientWidth

    for(let i in ecodir_responsive_keys) {
      el.classList.remove(`ecodir_${ecodir_responsive_keys[i]}`)
    }

    for(let i in ecodir_responsive_keys) {
      const ecodir_size = ecodir_responsive_keys[i]
      if(ecodir_parentContainerWidth > ecodir_responsive_sizes[ecodir_size]) {
        el.classList.add(`ecodir_${ecodir_size}`)
        break
      }
    }
  }

  ecodir_updateElementClasses(el)

  el.classList.add(`ecosystem-${ecodir_theme}`)

  el.innerHTML = `
    <div class="ecodir_container">
      <h2 class="ecodir_heading">INJECT_SETTINGS_HEADING</h2>
      <h3 class="ecodir_subheading">INJECT_SETTINGS_SUBHEADING</h3>
      <div class="ecodir_filters">
        <dropdown id="filterBy" name="Filter by:" :options="filterOptions" :callback="filterProjects"></dropdown>
        <dropdown id="sortBy" name="Sort by:" :options="sortOptions" :callback="sortProjects"></dropdown>
      </div>
      <div class="ecodir_container">
        <slider></slider>
        <project-view></project-view>
      </div>
    </div>
  `

  const dropdownComponent = {
    props: ['id', 'name', 'options', 'callback'],
    data () {
      return {
        dropdownContainerEl: null,
        dropdownHeight: null,
        dropdownToggleHeight: 3,
        selected: null,
        value: null,
        open: false
      }
    },
    methods: {
      toggleDropdown () {
        this.open = !this.open
      },
      closeDropdown () {
        if (this.open) this.open = false
      },
      selectOption (option, context = this) {
        this.selected = option.label
        this.value = option.value
        context.open = false
        this.callback(option.value)
      },
      setDimensions () {
        const dropdownToggleEl = this.$el.querySelector('.ecodir_dropdown-toggle')
        const dropdownEl = this.$el.querySelector('.ecodir_dropdown')
        this.dropdownContainerEl = this.$el.querySelector('.ecodir_dropdown-container')

        if (dropdownEl.clientWidth > dropdownToggleEl.clientWidth)
          dropdownToggleEl.style.width = `${dropdownEl.clientWidth + 100}px`

        this.dropdownHeight = dropdownEl.scrollHeight

        this.$nextTick(() => setTimeout(() => this.dropdownHeight = dropdownEl.scrollHeight, 1500))
      }
    },
    created () {
      this.selectOption(this.options[0])
    },
    mounted () {
      this.setDimensions()
      this.resize = this.setDimensions
    },
    watch: {
      open (val) {
        if (val) {
          this.dropdownContainerEl.style.height = `${this.dropdownHeight}px`
        } else {
          this.dropdownContainerEl.style.height = `${this.dropdownToggleHeight}px`
        }
      }
    },
    template: `
      <div :id="id" class="ecodir_dropdown-wrapper" v-on:click="toggleDropdown">
        <button class="ecodir_dropdown-toggle">
          <label>{{ name }}&emsp;<span>{{ selected }}</span></label>${ecodir_caret_svg()}</button>

        <div :class="{'ecodir_dropdown-container': true, hidden: open}">
          <div v-if="options.length" v-click-outside="closeDropdown" :class="{ecodir_dropdown: true}">
              <div v-for="option in options"
                :key="option.value"
                :data-value="option.value"
                :class="{ 'ecodir_dropdown-option': true, selected: (value === option.value) }"
                v-on:click="selectOption(option, this)">
                {{ option.label }}
              </div>
          </div>
        </div>
      </div>
    `
  }

  const sliderComponent = {
    data () {
      return {
        animate: true,
        currentIndex: 0,
        cardWidth: 180,
        display: 6,
        left: 0,
        range: 0,
      }
    },
    methods: {
      setActiveProject (slug) {
        this.$parent.setActiveProject(slug)
      },
      setSliderPosition () {
        this.left = (-1 * this.currentIndex) * this.cardWidth
      },
      updateSliderDisplay () {
        if (!this.$el) return
        setTimeout(() => {
          const ecodir_sliderEl = this.$el.querySelector('.ecodir_slider')
          const ecodir_sliderRowEl = this.$el.querySelector('.ecodir_slider-row-container')
          const ecodir_sliderCardEl = this.$el.querySelector('.ecodir_card')
          const ecodir_cardWidth = ecodir_sliderCardEl.clientWidth
          const ecodir_horizontalCardCount = Math.floor(ecodir_sliderEl.offsetWidth/ecodir_cardWidth)

          this.cardWidth = ecodir_cardWidth
          ecodir_sliderRowEl.style.width = `${(ecodir_horizontalCardCount * ecodir_cardWidth) + 10}px`
          this.display = ecodir_horizontalCardCount * 2
          this.range = this.indices * Math.min(this.currentIndex, this.indices / 2)
        }, 5)
      },
    },
    computed: {
      projects () {
        return this.$parent.projects
      },
      activeSlug () {
        return this.$parent.project && this.$parent.project.slug
      },
      featured () {
        return this.$parent.projects.filter(project => project.featured)
      },
      indices () {
        return this.projects.length - this.display
      }
    },
    mounted () {
      window.addEventListener('resize', this.updateSliderDisplay)
      this.updateSliderDisplay()
    },
    watch: {
      projects (val) {
        this.range = 0
        const ecodir_sliderInput = this.$el.querySelector('.ecodir_range-slider')

        if(val.length <= this.display) {
          ecodir_sliderInput.setAttribute('disabled', 'true')
          ecodir_sliderInput.style.opacity = 0
        } else {
          ecodir_sliderInput.removeAttribute('disabled')
          ecodir_sliderInput.style.opacity = 1
        }
        // ecodir_sliderInput.style.display =  ? 'none' : 'inline'
      },
      range (val) {
        this.animate = true
        const index = Math.trunc((val - (val % this.indices)) / this.indices)
        this.currentIndex = Math.max(0, Math.min(index, this.indices))
        this.setSliderPosition()
      }
    },
    template: `
      <div class="ecodir_slider-container">

        <div class="ecodir_slider">
          <div class="ecodir_slider-row-container">
            <div class="ecodir_slider-row" :class="{ sliding: animate }"
            :style="{ left: left + 'px', transition: 'left 300ms ease-in-out' }">

              <div v-for="project in projects" :key="project.slug" class="ecodir_card" :class="{ active: activeSlug === project.slug }" v-on:click="setActiveProject(project.slug)">
                <div v-if="project.logo && project.logo.icon" class="ecodir_card-thumbnail">
                  <img :src="'${ecodir_host}/images/projects/' + project.logo.icon" class="ecodir_card-logo"/>
                </div>
                <p v-if="project.name" class="ecodir_card-title">{{ project.name }}</p>
              </div>

            </div>
          </div>
        </div>

        <div class="ecodir_slider-controls">
          <input
            class="ecodir_range-slider"
            v-model="range"
            type="range"
            step="0.1"
            :min="indices / 2"
            :max="Math.ceil((indices * indices) / 2) + 1">
        </div>

      </div>
    `
  }

  const projectViewComponent = {
    methods: {
      setProjectContainerVisibility () {
        const projectContainerEl = this.$parent.projectContainerEl
        const projectWrapperEl = this.$parent.projectWrapperEl
        setTimeout(() => {
          projectContainerEl.style.height = `${projectWrapperEl.scrollHeight}px`
          projectContainerEl.style.opacity = 1
        }, 175);
      }
    },
    computed: {
      project () {
        return this.$parent.project
      },
      org () {
        return this.$parent.project.org ? this.$parent.project.org.join(', ') : ''
      }
    },
    mounted () {
      this.$parent.projectContainerEl = this.$el
      this.$parent.projectWrapperEl = this.$el.querySelector('.ecodir_project-view-wrapper')
      this.setProjectContainerVisibility()
      Vue.nextTick(() => setTimeout(this.setProjectContainerVisibility, 1500))
      window.addEventListener('resize', this.setProjectContainerVisibility)
    },
    watch: {
      project () {
        Vue.nextTick(this.setProjectContainerVisibility)
      }
    },
    template: `
      <div v-if="project" class="ecodir_project-view-container">
        <div class="ecodir_project-view-wrapper">
          <h4 v-if="project.name" class="ecodir_project-title">{{ project.name }}</h4>
          <h5 v-if="org" class="ecodir_project-organization">{{ org }}</h5>
          <p v-if="project.description && project.description.long" class="ecodir_project-description">{{ project.description.long }}</p>
          <a :href="'${ecodir_host}/project/' + project.slug" class="ecodir_project-link" target="_blank">INJECT_SETTINGS_PROJECT_LINK ${ecodir_caret_svg()}</a>
          <br/>
          <a href="${ecodir_host}" class="ecodir_project-home-link" target="_blank">INJECT_SETTINGS_ECOSYSTEM_LINK</a>
        </div>
      </div>
    `
  }

  Vue.directive('click-outside', {
    bind (el, binding, vnode) {
      el = el || this.el
      const funcName = binding ? binding.expression : this.expression
      const vm = vnode && vnode.context || this.vm

      el.clickOutsideEvent = function (e) {
        const dropdownEl = e.target.closest('.ecodir_dropdown-wrapper')
        if (dropdownEl && dropdownEl.id === vm.id) return
        vm[funcName](e)
      }
      el.pressEscKey = function (e) {
        if (e.defaultPrevented) { return }
        const key = e.key || e.keyCode
        if (key === 'Escape' || key === 'Esc' || key === 27) vm[funcName](e)
      }
      document.body.addEventListener('click', el.clickOutsideEvent)
      document.addEventListener('keyup', el.pressEscKey)
    },
    unbind (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
      document.removeEventListener('keyup', el.pressEscKey)
    }
  })

  // Initialize App
  new Vue({
    el: el,
    components: {
      'dropdown': dropdownComponent,
      'project-view': projectViewComponent,
      'slider': sliderComponent
    },
    data: {
      filterOptions: [{ label: 'INJECT_SETTINGS_FILTER_ALL', value: 'all' }].concat(ecodir_filters),
      sortOptions: [
        { label: 'INJECT_SETTINGS_SORT_A_Z', value: 'alphabetical-asc'},
        { label: 'INJECT_SETTINGS_SORT_Z_A', value: 'alphabetical-desc'},
        { label: 'INJECT_SETTINGS_SORT_DATE_ASC', value: 'since-asc'},
        { label: 'INJECT_SETTINGS_SORT_DATE_DESC', value: 'since-desc'}
      ],
      activeSort: 'alphabetical-asc',
      activeDropdown: null,
      projects: ecodir_projects,
      project: ecodir_projects[0],
      projectContainerEl: null,
      projectWrapperEl: null
    },
    mounted () {
      window.addEventListener('resize', this.updateResponsiveClass)
    },
    methods: {
      setActiveProject (slug) {
        const project = this.projects.filter(project => project.slug === slug)
        if (!project.length) return

        if(this.projectWrapperEl) {
          this.projectContainerEl.style.height = this.projectWrapperEl.scrollHeight
          this.projectContainerEl.style.opacity = 0
          setTimeout(() => this.project = project[0], 175);
        }
      },
      filterProjects (slug) {
        if (slug == 'all') {
          this.projects = ecodir_projects
        } else {
          this.projects = ecodir_projects.filter(project => project.filters.indexOf(slug) > -1)
        }
        if (this.projects.length && this.projects[0]) {
          this.sortProjects(this.activeSort)
        }
      },
      sortProjects (criteria) {
        switch (criteria) {
          case 'alphabetical-asc':
            this.projects = this.projects.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'alphabetical-desc':
            this.projects = this.projects.sort((a, b) => b.name.localeCompare(a.name))
            break
          case 'since-asc':
            this.projects = this.projects.sort((a, b) => {
              if (!a.sortNumbers || !a.sortNumbers.since || !b.sortNumbers || !b.sortNumbers.since) return
              return b.sortNumbers.since - a.sortNumbers.since
            })
            break
          case 'since-desc':
            this.projects = this.projects.sort((a, b) => {
              if (!a.sortNumbers || !a.sortNumbers.since || !b.sortNumbers || !b.sortNumbers.since) return
              return a.sortNumbers.since - b.sortNumbers.since
            })
            break
          default:
            return
        }
        this.activeSort = criteria
        this.setActiveProject(this.projects[0].slug)
      },
      updateResponsiveClass () {
        ecodir_updateElementClasses(this.$el)
      }
    }
  })

}

function ecodir_caret_svg() {
  return `
    <svg viewBox="0 0 4.875 7.155" class="ecodir_caret-svg">
      <g transform="translate(-525.941 -826.941)">
        <g transform="translate(280.754 1400.474) rotate(-90)">
          <path d="M0,0,2.756,2.517" transform="translate(572.473 246.247) rotate(90)"/>
          <path d="M0,2.517,2.756,0" transform="translate(569.955 246.247) rotate(90)"/>
        </g>
      </g>
    </svg>
  `
}
