const ecodir_host = 'https://localhost:20000'
const ecodir_targetClass = 'ipfs-ecosystem-embed'

ecodir_loadCSS()

if (typeof Vue !== 'undefined') {
  const version = Vue.version
  if (version && version.split('.')[0] < 3) ecodir_vueLoaded()
  else ecodir_unsupportedVueVersion()
} else {
  ecodir_loadVue()
}

function ecodir_loadCSS() {
  const ecodir_css = document.createElement('link')
  ecodir_css.rel = 'stylesheet'
  ecodir_css.type = 'text/css'
  ecodir_css.href = `${ecodir_host}/embeddable-view.min.css`
  ecodir_css.id = 'ipfs-ecosystem-stylesheet'
  document.head.appendChild(ecodir_css)
}

function ecodir_loadVue() {
  const ecodir_vueScript = document.createElement('script')
  ecodir_vueScript.src = `${ecodir_host}/vue.2.6.14.min.js`
  ecodir_vueScript.id = 'ipfs-ecosystem-vue'
  ecodir_vueScript.addEventListener('load', ecodir_vueLoaded)
  document.head.appendChild(ecodir_vueScript)
}

function ecodir_setActiveProjectJSON(callback) {
  const ecodir_projectList = document.createElement('script')
  ecodir_projectList.src = `${ecodir_host}/project-list.js`
  ecodir_projectList.id = 'ipfs-ecosystem-projects'
  ecodir_projectList.addEventListener('load', callback)
  document.head.appendChild(ecodir_projectList)
}

function ecodir_setActiveTaxonomyJSON(callback) {
  const ecodir_filters = document.createElement('script')
  ecodir_filters.src = `${ecodir_host}/taxonomy-list.js`
  ecodir_filters.id = 'ipfs-ecosystem-filters'
  ecodir_filters.addEventListener('load', callback)
  document.head.appendChild(ecodir_filters)
}

function ecodir_vueLoaded(e) {
  ecodir_setActiveProjectJSON(() => {
    ecodir_setActiveTaxonomyJSON(() => {
      if (!ecodir_projects) return ecodir_unsupportedVueVersion()
      document.querySelectorAll(`.${ecodir_targetClass}`).forEach(el => {
        ecodir_initDirectory(el)
      })
    })
  })
}

function ecodir_unsupportedVueVersion() {
  console.error('Unsupported Vue version')
  document.querySelectorAll(`.${ecodir_targetClass}`).forEach(el => {
    const blockSectionsHTML = count => new Array(count).fill(0).map(() => `<div class="ecodir_error-block-section"></div>`).join('')
    
    el.innerHTML = `
    <div class="ecodir_error-unsupported">
      ${blockSectionsHTML(6)}
      <h2 class="ecodir_error-heading">Unsupported Vue version</h2>
      ${blockSectionsHTML(7)}
    </div>
    `
  })
}

function ecodir_initDirectory(el) {
  const ecodir_theme = el.dataset.theme || 'light'

  el.classList.add(`ecosystem-${ecodir_theme}`)
  el.innerHTML = `
    <h2 class="ecodir_heading">Who's using IPFS</h2>
    <h3 class="ecodir_subheading">Discover projects successfully leveraging IPFS</h3>
    <div class="ecodir_filters">
      <dropdown name="Filter by:" :options="filterOptions" :callback="filterProjects" ></dropdown>
      <dropdown name="Sort by:" :options="sortOptions" :callback="sortProjects"></dropdown>
    </div>
    <div class="ecodir_container">
      <slider></slider>
      <project-view></project-view>
    </div>
  `

  const dropdownComponent = {
    props: ['name', 'options', 'callback'],
    data () {
      return {
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
        this.open = false
      },
      selectOption (option) {
        this.selected = option.label
        this.value = option.value
        this.open = false
        this.callback(option.value)
      }
    },
    created () {
      this.selectOption(this.options[0])
    },
    template: `
      <div class="ecodir_dropdown-wrapper">
        <button class="ecodir_dropdown-toggle" v-on:click.stop="toggleDropdown">
          <label>{{ name }}&emsp;{{ selected }}</label>${ecodir_caret_svg()}</button>

        <div v-if="options.length" v-click-outside="closeDropdown" :class="{ecodir_dropdown: true, hidden: !open }">
            <div v-for="option in options"
              :key="option.value"
              :data-value="option.value"
              :class="{ 'ecodir_dropdown-option': true, selected: (value === option.value) }"
              v-on:click="selectOption(option)">
              {{ option.label }}
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
        this.left = (this.currentIndex / -2) * this.cardWidth
      }
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
    watch: {
      projects (val) {
        this.range = 0
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
            :style="{ left: left + 'px'}">

              <div v-for="project in projects" :key="project.slug" class="ecodir_card" :class="{ active: activeSlug === project.slug }" v-on:click="setActiveProject(project.slug)">
                <div v-if="project.logo && project.logo.icon" class="ecodir_card-thumbnail">
                  <img :src="ecodir_host + '/images/projects/' + project.logo.icon" class="ecodir_card-logo"/>
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
            :max="indices * indices + 1">
        </div>

      </div>
    `
  }

  const projectViewComponent = {
    computed: {
      project () {
        return this.$parent.project
      },
      org () {
        return this.$parent.project.org ? this.$parent.project.org.join(', ') : ''
      }
    },
    template: `
      <div v-if="project" class="ecodir_project-view-container">
        <h4 v-if="project.name" class="ecodir_project-title">{{ project.name }}</h4>
        <h5 v-if="org" class="ecodir_project-organization">{{ org }}</h5>
        <p v-if="project.description && project.description.long" class="ecodir_project-description">{{ project.description.long }}</p>
        <a :href="ecodir_host + '/project/' + project.slug" class="ecodir_project-link" target="_blank">Learn More ${ecodir_caret_svg()}</a>
        <a href="${ecodir_host}" class="ecodir_project-home-link" target="_blank">View the entire ecosystem</a>
      </div>
    `
  }

  Vue.directive('click-outside', {
    bind (el, binding, vnode) {
      el.clickOutsideEvent = function (e) {
        if (!(el === e.target || el.contains(e.target))) {
          vnode.context[binding.expression](e)
        }
      }
      el.pressEscKey = function (e) {
        if (e.defaultPrevented) { return }
        const key = e.key || e.keyCode
        if (key === 'Escape' || key === 'Esc' || key === 27) {
          vnode.context[binding.expression](e)
        }
      }
      document.body.addEventListener('click', el.clickOutsideEvent)
      document.addEventListener('keyup', el.pressEscKey)
    },
    unbind (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
      document.removeEventListener('keyup', el.pressEscKey)
    }
  })  

  new Vue({
    el: el,
    components: {
      'dropdown': dropdownComponent,
      'project-view': projectViewComponent,
      'slider': sliderComponent
    },
    data: {
      filterOptions: [{ label: 'All', value: 'all' }].concat(ecodir_filters),
      sortOptions: [
        { label: 'Alphabetical (A-Z)', value: 'alphabetical-asc'},
        { label: 'Alphabetical (Z-A)', value: 'alphabetical-desc'},
        { label: 'Time on IPFS (newer)', value: 'since-asc'},
        { label: 'Time on IPFS (older)', value: 'since-desc'}
      ],
      activeSort: 'alphabetical-asc',
      projects: ecodir_projects,
      project: ecodir_projects[0]
    },
    methods: {
      setActiveProject (slug) {
        const project = this.projects.filter(project => project.slug === slug)

        if (!project.length) return

        this.project = project[0]
      },
      filterProjects (slug) {
        if (slug == 'all') {
          this.projects = ecodir_projects
        } else {
          this.projects = ecodir_projects.filter(project => project.filters.indexOf(slug) > -1)
        }
        if (this.projects.length && this.projects[0]) {
          this.setActiveProject(this.projects[0].slug)
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
              if(!a.sortNumbers || !a.sortNumbers.since || !b.sortNumbers || !b.sortNumbers.since) return
              return b.sortNumbers.since - a.sortNumbers.since
            })
            break
          case 'since-desc':
            this.projects = this.projects.sort((a, b) => {
              if(!a.sortNumbers || !a.sortNumbers.since || !b.sortNumbers || !b.sortNumbers.since) return
              return a.sortNumbers.since - b.sortNumbers.since
            })
            break
          default:
            return
        }
        this.activeSort = criteria
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