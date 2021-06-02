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
      <div class="col-5_md-8_sm-10_ti-12">
        <section id="section-project-info">
          <img
            v-if="project.logo && project.logo.full"
            class="logo"
            :src="$relativity(`/images/projects/${project.logo.full}`)"
            :alt="`${project.name} logo`">

          <h1 v-if="project.name" class="name">
            {{ project.name }}
          </h1>
          <h2 v-if="project.org" class="company">
            {{ project.org[0] }}
          </h2>
          <p v-if="project.description && project.description.long" class="description">
            {{ project.description.long }}
          </p>
          <div class="ctas">
            <a
              v-if="project.primaryCta && project.primaryCta.url && project.primaryCta.text"
              :href="project.primaryCta.url"
              target="_blank"
              class="primary-cta">
              {{ project.primaryCta.text }}
            </a>
            <a href="/" class="secondary-cta">
              Explore Ecosystem
            </a>
          </div>
        </section>
      </div>

      <div class="col-6_md-8_mi-10_ti-12" data-push-left="off-1_md-0">
        <section v-if="project.stats" id="section-statistics">
          <template v-for="(stat, i) in project.stats">
            <div
              v-if="stat.value && stat.label"
              :key="`big-number-${i}`"
              class="card big-number">
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
            class="card case-study">
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
        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5_mi-10_ti-12">
        <section v-if="project.links || project.keyInfo" id="section-key-info">
          <h3 class="heading">
            Key info
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
                        <a href="link.url" target="_blank">
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
                      :to="{ path: '/', query: { tag: taxonomyTag } }"
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
      <div class="grid-center">

        <div class="col-12">
          <h3 class="heading">
            {{ pageData.section_featured_slider.heading }}
          </h3>
          <div class="description">
            {{ pageData.section_featured_slider.description }}
          </div>
        </div>

        <div class="col-11_mi-12">
          <FeaturedProjectsSlider />
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

// ====================================================================== Export
export default {
  name: 'ProjectSingularPage',

  components: {
    Breadcrumbs,
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent,
    FeaturedProjectsSlider
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
      id: `project-${id}`
    }
  },

  async fetch ({ store, req, route, error }) {
    await store.dispatch('global/getBaseData', 'general')
    await store.dispatch('global/getBaseData', 'taxonomy')
    await store.dispatch('projects/getProjects')
  },

  head () {
    const title = this.seo.title
    const description = this.seo.description
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
    // SEO
    seo () {
      return this.$getSeo(this.tag)
    },
    breadcrumbs () {
      return [
        {
          type: 'a',
          href: 'https://ipfs.io',
          target: '_blank',
          label: 'Home'
        },
        {
          type: 'nuxt-link',
          href: '/',
          label: 'IPFS Ecosystem'
        },
        {
          type: 'nuxt-link',
          href: '/',
          query: { filters: 'enabled' },
          label: 'All projects'
        },
        {
          type: 'div',
          label: this.project.name
        }
      ]
    },
    // Project Content
    pageData () {
      const siteContent = this.siteContent
      if (siteContent.hasOwnProperty('general')) {
        return siteContent.general
      }
      return false
    },
    taxonomies () {
      return this.project.taxonomies.filter(tax => this.$checkTaxonomyCategoryExists(tax.slug))
    }
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
  margin-bottom: 3.75rem;
  @include medium {
    margin-bottom: 2rem;
  }
  .name {
    @include fontSize_ExtraExtraLarge;
    font-weight: 700;
    @include small {
      @include leading_Mini;
      margin-bottom: 0.5rem;
    }
  }
  .description {
    @include leading_Mini;
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
    width: 100%;
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
      padding: 2rem;
    }
    .statistic {
      font-size: 2.625rem;
      @include small {
        @include fontSize_ExtraLarge;
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
    .title,
    .description {
      color: $tundora;
    }
    .title {
      @include fontSize_Large;
    }
    .description {
      @include fontSize_Small;
      @include leading_Mini;
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
  }
}

// ////////////////////////////////////////////////////////// [Section] Key Info
#section-key-info {
  .heading {
    @include fontSize_ExtraLarge;
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
      margin-bottom: 1rem;
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
      margin-bottom: 0.25rem;
    }

    a {
      color: $cerulean;
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

::v-deep .project-card {
  .thumbnail {
    border: 2px solid #F5F4F4;
  }
}
</style>
