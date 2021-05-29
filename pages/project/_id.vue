<template>
  <div :class="`page page-${tag} ${id} container`">

    <div v-if="breadcrumbs" class="grid-noGutter">
      <div class="col">
        <section id="section-breadcrumbs">
          <Breadcrumbs :breadcrumbs="breadcrumbs" />
        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5">
        <section id="section-project-info">
          <img
            v-if="project.logo && project.logo.full"
            class="logo"
            :src="$relativity(`/images/${project.logo.full}`)"
            :alt="`${project.name} logo`">

          <h1 v-if="project.name" class="name">
            {{ project.name }}
          </h1>
          <h2 v-if="project.org && project.org.length" class="company">
            {{ project.org[0] }}
          </h2>
          <p v-if="project.description && project.description.long" class="description">
            {{ project.description.long }}
          </p>
          <div class="ctas">
            <a v-if="project.primaryCta" :href="project.primaryCta.url" target="_blank" class="primary-cta">
              {{ project.primaryCta.text }}
            </a>
            <a href="/" class="secondary-cta">
              Explore Ecosystem
            </a>
          </div>
        </section>
      </div>

      <div class="col-6" data-push-left="off-1">
        <section id="section-statistics">
          <template v-for="(stat, i) in project.stats">
            <div
              v-if="stat.value && stat.value !== '' && stat.label && stat.label !== ''"
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
          <div v-if="project.ctaCard" class="card case-study">
            <p v-if="project.ctaCard.title" class="title">
              {{ project.ctaCard.title }}
            </p>
            <p v-if="project.ctaCard.description" class="description">
              {{ project.ctaCard.description }}
            </p>
            <a v-if="project.ctaCard.url" class="cta" :href="project.ctaCard.url" target="_blank">
              {{ project.ctaCard.buttonText }}
            </a>
          </div>
        </section>
      </div>
    </div>

    <div class="grid">
      <div class="col-5">
        <section v-if="project.links || project.keyInfo" id="section-key-info">
          <h3 class="heading">
            Key info
          </h3>

          <dl v-if="project.links" class="values">
            <template v-for="(linkGroup, i) in project.links">
              <dt :key="`project-link-key-${i}`" class="name">
                {{ linkGroup.label }}
              </dt>

              <dd :key="`project-val-${i}`">
                <ul class="links">
                  <li
                    v-for="(link, j) in linkGroup.links"
                    :key="`link-group-${j}`">
                    <a href="link.url" target="_blank">
                      {{ $truncateString(link.text, 12, '...', type = 'double') }}
                    </a>
                    <div v-if="link.text.length > 23" class="link-tooltip" :data-tooltip="link.text" data-tooltip-theme="dark">
                      ?
                    </div>
                  </li>
                </ul>
              </dd>
            </template>

            <template v-for="(info, i) in project.keyInfo">
              <dt :key="`keyinfo-key-${i}`" class="name">
                {{ info.label }}
              </dt>

              <dd :key="`keyinfo-val-${i}`" class="text">
                {{ info.value }}
              </dd>
            </template>
          </dl>
        </section>

        <section
          v-if="project.video && getEmbedUrl(project.video).id"
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

      <div class="col-6" data-push-left="off-1">
        <section v-if="project.taxonomies" id="section-filters">
          <Accordion
            v-slot="{ active }"
            :multiple="true">
            <AccordionSection
              v-for="(taxonomy, i) in taxonomies"
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
                <div class="chiclet-container">
                  <a
                    v-for="(taxonomyTag, j) in filterTags(taxonomy.slug, taxonomy.tags)"
                    :key="`taxonomu-tag-${j}`"
                    :href="taxonomyTag"
                    class="chiclet">
                    {{ $getTaxonomyTagLabel(taxonomy.slug, taxonomyTag) }}
                  </a>
                </div>
              </AccordionContent>
            </AccordionSection>
          </Accordion>
        </section>
      </div>
    </div>

    <!-- <section id="section-featured-slider">
      <div class="grid-center">

        <div class="col-12">
          <h3 class="heading">
            Featured
          </h3>
          <div class="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </div>
        </div>

        <div class="col-11">
          <FeaturedProjectsSlider />
        </div>

      </div>
    </section> -->

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Breadcrumbs from '@/modules/zero/core/Components/Breadcrumbs'
import Accordion from '@/modules/zero/core/Components/Accordion/Accordion'
import AccordionHeader from '@/modules/zero/core/Components/Accordion/Header'
import AccordionSection from '@/modules/zero/core/Components/Accordion/Section'
import AccordionContent from '@/modules/zero/core/Components/Accordion/Content'
// import FeaturedProjectsSlider from '@/components/FeaturedProjectsSlider/FeaturedProjectsSlider'

// ====================================================================== Export
export default {
  name: 'ProjectSingularPage',

  components: {
    Breadcrumbs,
    Accordion,
    AccordionHeader,
    AccordionSection,
    AccordionContent
    // FeaturedProjectsSlider
  },

  data () {
    const id = this.$route.params.id
    return {
      tag: 'project',
      id: `project-${id}`
    }
  },

  async fetch ({ store, req, route, error }) {
    const id = route.params.id
    try {
      const project = require(`@/content/projects/${id}.json`)
      await store.dispatch('global/getBaseData', 'general')
      await store.dispatch('global/getBaseData', 'taxonomy')
      await store.dispatch('global/getBaseData', {
        key: `project-${id}`,
        data: project
      })
    } catch (e) {
      return error('This project does not exist')
    }
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
    project () {
      const siteContent = this.siteContent
      const id = this.id
      return siteContent.hasOwnProperty(id) ? siteContent[id] : false
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
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page {
  background-color: $white;
}

#section-breadcrumbs {
  padding: 50px 0 36px;
}

#section-project-info {
  margin-bottom: 60px;

  .logo {
    width: auto;
    height: auto;
    max-height: 100px;
    max-width: 100%;
  }

  .name {
    font-weight: 700;
    font-size: 50px;
  }

  .company {
    font-family: $fontInter;
    font-size: 18px;
    margin-bottom: 45px;
  }

  .description {
    line-height: 20px;
    margin-bottom: 50px;
  }

  .ctas {
    display: flex;
    column-gap: 24px;

    a {
      color: $blackPearl;
      padding: 10px 20px;

      &.primary-cta {
        border: 2px solid $blackPearl;
        border-radius: 5px;
      }
      &.secondary-cta {
        background: url('~assets/theme/svgs/chevronright.svg') no-repeat right center;
        line-height: 28px;
        padding-right: 25px;
      }
    }
  }
}

#section-statistics {
  margin-bottom: 60px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 10px;
  column-gap: 14px;

  .card {
    border-radius: 5px;
    text-align: center;
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .description {
      width: 200px;
    }

    &.big-number {
      background-color: $blackHaze;

      .statistic {
        font-family: $fontMontserrat;
        font-weight: 600;
        font-size: 42px;
      }

      .description {
        font-size: 20px;
        line-height: 24px;
      }
    }

    &.case-study {
      border: 2px solid $tiber;

      .title {
        font-family: $fontMontserrat;
        font-size: 18px;
        margin-bottom: 15px;
      }

      .description {
        font-size: 13px;
        line-height: 16px;
        letter-spacing: 0.02em;
      }

      .cta {
        border-radius: 5px;
        background-color: $tiber;
        font-size: 14px;
        color: $white;
        letter-spacing: 0.02em;
        padding: 7px 30px;
        margin-top: 30px;
      }
    }

  }
}

#section-key-info {
  margin-bottom: 60px;

  .heading {
    font-size: 24px;
    margin-bottom: 35px;
  }

  .values {
    display: grid;
    grid-template-columns: 30% auto;
    row-gap: 25px;
    column-gap: 8%;

    dd {
      margin: 0;
    }

    .name {
      letter-spacing: 0.02em;
    }

    .links {
      list-style: none;
      padding: 0;

      li {
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      a {
        color: $cerulean;
      }

      .link-tooltip {
        cursor: default;
        background-color: $blackHaze;
        border-radius: 3px;
        font-size: 10px;
        width: 15px;
        height: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &[data-tooltip] {
          &:before,
          &:after {
            border-radius: 5px;
            font-size: 14px;
            z-index: 1;
          }
        }
      }
    }
  }
}

#section-video {
  .video {
    border-radius: 7px;
  }
}

#section-filters {
  .accordion-content {
    padding: 0 5px;
  }

  .accordion-header {
    cursor: pointer;
    position: relative;
    padding: 0 5px 15px;

    &:after {
      content: '';
      background: url('~assets/theme/svgs/chevrondown.svg') no-repeat right center;
      position: absolute;
      top: 0;
      right: 5px;
      width: 13px;
      height: 100%;
      display: inline-block;
    }
  }

  .accordion-section.open {
    .accordion-header {
      &:after {
        transform: rotate(180deg);
      }
    }
  }

  .heading {
    font-size: 20px;
  }

  .chiclet-container {
    padding-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 10px;
  }

  .chiclet {
    background: $blackHaze;
    border-radius: 5px;
    color: $blackPearl;
    font-size: 12px;
    padding: 5px 14px;
  }
}

#section-featured-slider {
  margin-top: 95px;
}
</style>
