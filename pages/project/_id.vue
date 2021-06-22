<template>
  <div :class="`page page-${tag} ${id} container`">

    <div v-if="breadcrumbs" class="grid">
      <div class="col">
        <section id="section-breadcrumbs">
          <Breadcrumbs :breadcrumbs="breadcrumbs" />
        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5_md-8_sm-10_mi-12">
        <section id="section-project-info">
          <img
            v-if="project.logo && project.logo.full"
            class="logo"
            :src="$relativity(`/images/projects/${project.logo.full}`)"
            :alt="`${project.name} logo`">

          <h1 v-if="project.name" class="name">
            {{ project.name }}
          </h1>
          <h2 v-if="organizations" class="company">
            {{ organizations }}
          </h2>
          <p v-if="description" class="description">
            {{ description }}
          </p>
          <div class="ctas">
            <a
              v-if="project.primaryCta && project.primaryCta.url && project.primaryCta.text"
              :href="project.primaryCta.url"
              target="_blank"
              class="primary-cta">
              {{ project.primaryCta.text }}
            </a>
            <nuxt-link to="/" class="secondary-cta">
              {{ secondaryCtaButtonText }}
            </nuxt-link>
          </div>
        </section>
      </div>

      <div class="col-6_md-8_mi-12" data-push-left="off-1_md-0">
        <section v-if="project.stats" id="section-statistics">

          <template v-for="(stat, i) in project.stats">
            <div
              v-if="stat.value && stat.label"
              :key="`big-number-${i}`"
              :class="['card', 'big-number', { 'hide-tiny': moreThanTwo } ]">
              <p class="statistic">
                {{ stat.value }}
              </p>
              <p class="description">
                {{ stat.label }}
              </p>
            </div>
          </template>

          <div
            v-if="project.ctaCard && project.ctaCard.title && project.ctaCard.description"
            :class="['card', 'case-study', { 'hide-tiny': moreThanTwo } ]">
            <p v-if="project.ctaCard.title" class="title">
              {{ project.ctaCard.title }}
            </p>
            <p v-if="project.ctaCard.description" class="description">
              {{ project.ctaCard.description }}
            </p>
            <a
              v-if="project.ctaCard.url && project.ctaCard.buttonText"
              class="cta"
              :href="project.ctaCard.url"
              target="_blank">
              {{ project.ctaCard.buttonText }}
            </a>
          </div>

          <div class="slider-display col-6_md-8_mi-12">
            <div
              v-if="moreThanTwo"
              ref="sliderFlex"
              class="slider-flex slider-transition">
              <div
                v-for="slide in slider"
                :key="slide.label || slide.title"
                v-hammer:swipe.horizontal="onSwipe"
                :class="['card', (slide.label ? 'big-number' : 'case-study'), 'slider-mobile', { 'more-than-two' : moreThanTwo }]">
                <div class="slide-nav">
                  <button
                    class="nav-arrow"
                    @click="incrementLeft">
                    <PrevArrow stroke="#052437" width="10" height="15" />
                  </button>
                  <p :class="(slide.label ? 'statistic' : 'title')">
                    {{ slide.value || slide.title }}
                  </p>
                  <button
                    class="nav-arrow"
                    @click="incrementRight">
                    <NextArrow stroke="#052437" width="10" height="15" />
                  </button>
                </div>
                <p class="description">
                  {{ slide.label || slide.description }}
                </p>
                <a
                  v-if="slide.url && slide.buttonText"
                  class="cta"
                  :href="slide.url"
                  target="_blank">
                  {{ slide.buttonText }}
                </a>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5_mi-10_mi-12">
        <section v-if="project.links || project.keyInfo" id="section-key-info">
          <h3 class="heading">
            {{ metadataHeading }}
          </h3>

          <dl v-if="project.links" class="values">
            <template v-for="(linkGroup, i) in project.links">
              <template v-if="linkGroup.label && checkIfArrayOfNullObjectValues(linkGroup.links)">
                <dt :key="`project-link-key-${i}`" class="name">
                  {{ linkGroup.label }}
                </dt>
                <dd :key="`project-val-${i}`">
                  <ul class="links">
                    <template v-for="(link, j) in linkGroup.links">
                      <li
                        v-if="link.text && link.url"
                        :key="`link-group-${j}`">
                        <a :href="link.url" target="_blank">
                          {{ $truncateString(link.text, 12, '...', type = 'double') }}
                        </a>
                        <div
                          v-if="link.text.length > 23"
                          class="link-tooltip"
                          :data-tooltip="link.text"
                          data-tooltip-theme="dark">
                          ?
                        </div>
                      </li>
                    </template>
                  </ul>
                </dd>
              </template>
            </template>

            <template v-if="checkIfArrayOfNullObjectValues(project.keyInfo)">
              <template v-for="(info, i) in project.keyInfo">
                <template v-if="info.label && info.value">
                  <dt :key="`keyinfo-key-${i}`" class="name">
                    {{ info.label }}
                  </dt>
                  <dd :key="`keyinfo-val-${i}`" class="text">
                    {{ info.value }}
                  </dd>
                </template>
              </template>
            </template>
          </dl>
        </section>

        <section
          v-if="project.video && getEmbedUrl(project.video)"
          id="section-video">
          <div class="video-wrapper">
            <iframe
              :src="getEmbedUrl(project.video)"
              class="video"
              allow="autoplay; encrypted-media"
              allowfullscreen>
            </iframe>
          </div>
        </section>

      </div>

      <div class="col-6_sm-7_mi-12" data-push-left="off-1_sm-0">
        <section
          v-if="checkIfArrayOfNullObjectValues(project.taxonomies)"
          id="section-filters">
          <Accordion
            v-slot="{ active }"
            :multiple="true">
            <template v-for="(taxonomy, i) in taxonomies">
              <AccordionSection
                v-if="taxonomy.slug && taxonomy.tags"
                :key="`taxonomy-category-${i}`"
                :active="active"
                :selected="true"
                class="filters">
                <AccordionHeader>
                  <h3 class="heading">
                    {{ $getTaxonomyCategoryLabel(taxonomy.slug) }}
                  </h3>
                </AccordionHeader>
                <AccordionContent>
                  <div class="chiclet-list">
                    <NuxtLink
                      v-for="(taxonomyTag, j) in filterTags(taxonomy.slug, taxonomy.tags)"
                      :key="`taxonomu-tag-${j}`"
                      :to="{ path: '/', query: { filters: 'enabled', tag: taxonomyTag } }"
                      class="chiclet">
                      {{ $getTaxonomyTagLabel(taxonomy.slug, taxonomyTag) }}
                    </NuxtLink>
                  </div>
                </AccordionContent>
              </AccordionSection>
            </template>
          </Accordion>
        </section>
      </div>
    </div>

    <section id="section-featured-slider">
      <div class="outerbox">
        <div class="featured-box">
          <div class="grid-center">

            <div class="col-12">
              <h3 class="heading">
                {{ generalPageData.section_featured_slider.heading }}
              </h3>
              <div class="description">
                {{ generalPageData.section_featured_slider.description }}
              </div>
            </div>

            <div class="col-11_mi-12">
              <FeaturedProjectsSlider />
            </div>

          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import Breadcrumbs from '@/modules/zero/core/Components/Breadcrumbs'
import Accordion from '@/modules/zero/core/Components/Accordion/Accordion'
import AccordionHeader from '@/modules/zero/core/Components/Accordion/Header'
import AccordionSection from '@/modules/zero/core/Components/Accordion/Section'
import AccordionContent from '@/modules/zero/core/Components/Accordion/Content'
import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'
import PrevArrow from '@/components/Icons/PrevArrow'
import NextArrow from '@/components/Icons/NextArrow'

// =================================================================== Functions
const repositionSliderLeft = (instance) => {
  if (window.matchMedia('(max-width: 25.9375rem)').matches && instance.$refs.sliderFlex) { // tiny
    const slide = instance.$refs.sliderFlex.firstChild
    const amt = (instance.slider.length === 4) ? 1 : 0
    const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))
    instance.$refs.sliderFlex.style.left = (amt * ((shift / 2) * -1)) + 'px'
  }
}

// ====================================================================== Export
export default {
  name: 'ProjectSingularPage',

  components: {
    Breadcrumbs,
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent,
    FeaturedProjectsSlider,
    PrevArrow,
    NextArrow
  },

  asyncData ({ app, route, error, payload }) {
    if (payload) { return { project: CloneDeep(payload) } }
    try {
      const project = CloneDeep(require(`@/content/projects/${route.params.id}.json`))
      app.$setProjectDefaults(project)
      return { project }
    } catch (e) {
      return error('This project does not exist')
    }
  },

  data () {
    const id = this.$route.params.id
    return {
      tag: 'project',
      id: `project-${id}`,
      initSlider: false,
      resize: false,
      project: false
    }
  },

  async fetch ({ store, req, route, error }) {
    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'project')
    await store.dispatch('global/getBaseData', 'taxonomy')
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = this.page_Title
    const description = this.page_Description
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:site_name', property: 'og:site_name', content: this.seo.og_site_name },
        { hid: 'og:url', property: 'og:url', content: this.seo.og_url },
        { hid: 'og:type', property: 'og:type', content: this.seo.og_type },
        { hid: 'og:image', property: 'og:image', content: this.seo.og_image },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:image', name: 'twitter:image', content: this.seo.og_image }
      ]
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'global/siteContent'
    }),
    seo () {
      return this.$getSeo(this.tag)
    },
    name () {
      return this.project.name
    },
    page_Title () {
      return `${this.name} | ${this.seo.title}`
    },
    page_Description () {
      return `${this.name} | ${this.description}`
    },
    pageData () {
      return this.siteContent.project.page_content
    },
    secondaryCtaButtonText () {
      return this.pageData.secondary_cta_button_text
    },
    metadataHeading () {
      return this.pageData.metadata_heading
    },
    breadcrumbs () {
      const breadcrumbs = CloneDeep(this.pageData.breadcrumbs)
      breadcrumbs.push({
        type: 'div',
        label: this.project.name
      })
      return breadcrumbs
    },
    // Project Content
    generalPageData () {
      return this.siteContent.general
    },
    description () {
      const description = this.project.description
      const long = description.long
      const short = description.short
      if (!long && !short) { return false }
      if (long) { return long }
      return short
    },
    organizations () {
      const orgs = this.project.org
      if (!orgs) { return false }
      return orgs.join(', ')
    },
    taxonomies () {
      return this.project.taxonomies.filter(tax => this.$checkTaxonomyCategoryExists(tax.slug))
    },
    moreThanTwo () {
      let amt = 0
      const len = this.project.stats.length
      for (let i = 0; i < len; i++) {
        if (this.project.stats[i].label && this.project.stats[i].value) {
          amt += 1
        }
      }
      amt += (this.project.ctaCard ? 1 : 0)
      return (amt > 2)
    },
    slider () {
      const items = []
      if (this.moreThanTwo) {
        const cloned = CloneDeep(this.project.stats)
        for (let i = 0; i < cloned.length; i++) {
          if (cloned[i].label && cloned[i].value) {
            items.push(cloned[i])
          }
        }
        if (this.project.ctaCard.title) {
          const cta = CloneDeep(this.project.ctaCard)
          items.push(cta)
        }
        return items
      }
      return false
    }
  },

  mounted () {
    repositionSliderLeft(this)
    this.resize = () => { repositionSliderLeft(this) }
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) { window.removeEventListener('resize', this.resize) }
  },

  methods: {
    filterTags (categorySlug, tags = []) {
      return tags.filter(tag => this.$checkTaxonomyTagExists(categorySlug, tag))
    },
    getEmbedUrl (url) {
      return this.$buildVideoEmbedUrl(this.$parseVideoUrl(url))
    },
    checkIfArrayOfNullObjectValues (array) {
      if (!Array.isArray(array) || array.length === 0) { return false }
      const compiled = []
      let nullCount = 0
      array.forEach((obj) => {
        nullCount = 0
        if (typeof obj === 'object' && !Array.isArray(obj)) {
          const keys = Object.keys(obj)
          const len = keys.length
          for (const key in obj) {
            if (obj[key] === null) {
              nullCount += 1
            }
          }
          if (len !== nullCount) {
            compiled.push(obj)
          }
        }
      })
      return compiled.length > 0 ? compiled : false
    },
    incrementLeft () {
      this.$refs.sliderFlex.classList.remove('slider-transition')
      const flex = this.$refs.sliderFlex
      const last = flex.lastElementChild
      const first = flex.firstElementChild
      flex.insertBefore(last, first)

      const slide = this.$refs.sliderFlex.firstChild
      const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))

      flex.style.left = parseFloat(flex.style.left) + shift * -1 + 'px'
      setTimeout(() => {
        this.$refs.sliderFlex.classList.add('slider-transition')
        flex.style.left = parseFloat(flex.style.left) + shift + 'px'
      }, 100)
    },
    incrementRight () {
      this.$refs.sliderFlex.classList.remove('slider-transition')
      const flex = this.$refs.sliderFlex
      const last = flex.lastElementChild
      const first = flex.firstElementChild
      last.parentNode.insertBefore(first, last.nextSibling)

      const slide = this.$refs.sliderFlex.firstChild
      const shift = slide.offsetWidth + (2 * parseFloat(getComputedStyle(slide).marginLeft))

      flex.style.left = parseFloat(flex.style.left) + shift + 'px'
      setTimeout(() => {
        this.$refs.sliderFlex.classList.add('slider-transition')
        flex.style.left = parseFloat(flex.style.left) + shift * -1 + 'px'
      }, 100)
    },
    onSwipe (e) {
      if (e.type === 'swipeleft') {
        this.incrementRight()
      } else if (e.type === 'swiperight') {
        this.incrementLeft()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  background-color: $white;
}

// /////////////////////////////////////////////////////// [Section] Breadcrumbs
#section-breadcrumbs {
  padding: 3rem 0 1.75rem;
}

// ////////////////////////////////////////////////////// [Section] Project Info
#section-project-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 3.75rem;
  @include medium {
    margin-bottom: 2rem;
  }
  .name {
    @include fontSize_ExtraExtraLarge;
    @include leading_Mini;
    font-weight: 700;
    margin-left: -0.125rem;
    @include small {
      margin-bottom: 0.5rem;
    }
  }
  .description {
    @include fontSize_Medium;
    font-family: $fontInter;
    margin-bottom: 3rem;
  }
}

.logo {
  width: auto;
  height: auto;
  max-height: 6.5rem;
  max-width: 60%;
  margin-bottom: 1.25rem;
}

.company {
  @include fontSize_Medium;
  font-family: $fontInter;
  margin-bottom: 2.5rem;
  opacity: 0.7;
}

.ctas {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include tiny {
    flex-direction: column;
    align-items: flex-start;
  }
  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 600;
    color: $blackPearl;
    &.primary-cta {
      @include borderRadius3;
      border: 2px solid $tiber;
      padding: 0.625rem 1.25rem;
      margin-right: 1.5rem;
      @include tiny {
        margin-right: 0;
        margin-bottom: 1rem;
      }
      &:hover {
        color: white;
        background-color: $blackPearl;
      }
    }
    &.secondary-cta {
      background: url('~assets/theme/svgs/chevronright.svg') no-repeat right center;
      padding-right: 1rem;
    }
  }
}

// //////////////////////////////////////////////////////// [Section] Statistics
#section-statistics {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.card {
  @include borderRadius3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: calc(50% - 0.5rem);
  padding: 3rem;
  margin-bottom: 1rem;
  @include small {
    padding: 2rem;
  }
  @include mini {
    padding: 1rem;
  }
  @include tiny {
    min-width: calc(100vw - 4rem);
    max-width: calc(100vw - 4rem);
    width: calc(100vw - 4rem) !important;
    box-sizing: border-box;
    padding: 2rem;
  }
  &:nth-child(odd) {
    margin-right: 1rem;
    @include tiny {
      margin-right: 0;
    }
  }
  &.big-number {
    color: $tiber;
    background-color: $blackHaze;
    @include mini {
      padding: 2rem 1rem;
    }
    @include tiny {
      padding: 3rem 2rem;
    }
    .statistic {
      @include leading_Mini;
      font-size: 2.625rem;
      @include small {
        @include fontSize_ExtraLarge;
      }
      @include tiny {
        margin: 0 0.5rem;
      }
    }
    .description {
      @include fontSize_Large;
      @include leading_Mini;
      @include small {
        @include fontSize_Regular;
      }
    }
  }
  &.case-study {
    border: 2px solid $tiber;
    @include tiny {
      padding: 3rem 2rem;
    }
    .title,
    .description {
      color: $tundora;
    }
    .title {
      @include fontSize_Large;
      @include leading_Mini;
      @include tiny {
        @include fontSize_Medium;
        margin: 0 0.5rem;
      }
      @media screen and (max-width: 20rem) {
        @include fontSize_Small;
      }
    }
    .description {
      @include fontSize_Small;
      @include leading_Mini;
      @include tiny {
        margin-bottom: 2rem;
      }
    }
    .cta {
      @include borderRadius3;
      @include fontSize_Small;
      padding: 0.5rem 2rem;
      margin-top: 2rem;
      color: $white;
      font-weight: 600;
      background-color: $tiber;
    }
  }
  .statistic,
  .title {
    font-family: $fontMontserrat;
    margin-bottom: 1rem;
    @include tiny {
      margin-bottom: 0;
    }
  }
  &.hide-tiny {
    @include tiny {
      display: none;
    }
  }
}

.slider-display {
  overflow: hidden;
}

.slider-flex {
  display: none;
  @include tiny {
    position: relative;
    display: flex;
    justify-content: center;
  }
}

.slider-transition {
  transition: all 500ms ease-in-out;
}

.slider-mobile {
  display: none;
  &.more-than-two {
    @include tiny {
      display: flex;
      flex: 1 1 auto;
      margin: 0 1rem;
    }
  }
}

.slide-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @include tiny {
    justify-content: space-between;
    margin-bottom: 1rem;
  }
}

.nav-arrow {
  @include borderRadius3;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
  color: rgba(0, 0, 0, 0.5);
  border: none;
  font-weight: 900;
  width: 3.75rem;
  @include small {
    width: auto;
  }
  &:hover {
    color: rgb(2, 28, 54);
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

// ////////////////////////////////////////////////////////// [Section] Key Info
#section-key-info {
  .heading {
    @include fontSize_ExtraMediumLarge;
    margin-bottom: 2rem;
  }
}

.values {
  display: grid;
  grid-template-columns: 30% auto;
  row-gap: 1rem;
  column-gap: 5%;

  @include small {
    grid-template-columns: auto;
    row-gap: 0;
  }

  dd {
    margin: 0;
    &:not(:last-child) {
      @include small {
        margin-bottom: 1.25rem;
      }
    }
  }

  dt,
  li {
    font-weight: 600;
  }

  .links {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    a {
      color: $ming;
    }

    .link-tooltip {
      @include borderRadius3;
      @include fontSize_Mini;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: $blackHaze;
      width: 1rem;
      height: 1rem;
      cursor: help;

      &[data-tooltip] {
        &:before,
        &:after {
          @include borderRadius3;
          @include fontSize_Small;
          z-index: 1;
        }
      }
    }
  }
}

// ///////////////////////////////////////////////////////////// [Section] Video
#section-video {
  margin-top: 4rem;
}

.video {
  @include borderRadius3;
}

// /////////////////////////////////////////////////////////// [Section] Filters
#section-filters {
  @include mini {
    margin-top: 2rem;
  }
  .heading {
    @include fontSize_Large;
  }
}

.accordion-header {
  position: relative;
  padding: 0 0.3125rem 1rem;
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

.accordion-content {
  padding: 0 0.3125rem;
}

.chiclet-list {
  padding-bottom: 2rem;
}

// /////////////////////////////////////////////////// [Section] Featured Slider
#section-featured-slider {
  .heading,
  .description {
    @include xlarge {
      padding-left: 2rem;
    }
    @include large {
      padding-left: 0;
    }
  }
  margin-top: 4rem;
  padding-bottom: 4rem;
  @include mini {
    margin-top: 2rem;
    padding-bottom: 2rem;
  }
}

#featured-projects-slider {
  margin-top: 1rem;
}

.featured-box {
  padding-top: 4.75rem;
  max-width: 90rem;
  margin: auto;
  border: 2px solid #E5E5E5;
  @include borderRadius3;
  @include xlarge {
    margin: auto 3.75rem;
  }
  @include large {
    padding-top: 3.75rem;
    margin: auto 1.5rem;
  }
  @include mini {
    margin: auto;
  }
}

::v-deep .project-card {
  .thumbnail {
    border: 2px solid #F5F4F4;
  }
}
</style>
