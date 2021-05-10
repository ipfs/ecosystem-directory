<template>
  <div :class="`page page-${tag} ${id} container`">

    <div class="grid-noGutter">
      <div class="col">
        <section v-if="project.breadcrumbs" id="section-breadcrumbs">
          <Breadcrumbs :breadcrumbs="project.breadcrumbs" />
        </section>
      </div>
    </div>

    <div class="grid">

      <div class="col-5">
        <section v-if="project.section_project_info" id="section-project-info">
          <img v-if="project.section_project_info.logo" class="logo" :src="project.section_project_info.logo" :alt="`${project.section_project_info.name} logo`">

          <h1 v-if="project.section_project_info.name" class="name">
            {{ project.section_project_info.name }}
          </h1>
          <h2 v-if="project.section_project_info.company" class="company">
            {{ project.section_project_info.company }}
          </h2>
          <p v-if="project.section_project_info.description" class="description">
            {{ project.section_project_info.description }}
          </p>
          <div class="ctas">
            <a v-if="project.section_project_info.primary_cta" :href="project.section_project_info.primary_cta.url" :target="project.section_project_info.primary_cta.target || '_self'" class="primary-cta">
              {{ project.section_project_info.primary_cta.text }}
            </a>
            <a v-if="project.section_project_info.secondary_cta" :href="project.section_project_info.secondary_cta.url" :target="project.section_project_info.secondary_cta.target || '_self'" class="secondary-cta">
              {{ project.section_project_info.secondary_cta.text }}
            </a>
          </div>
        </section>
      </div>

      <div class="col-6" data-push-left="off-1">
        <section v-if="project.section_statistics" id="section-statistics">
          <div v-for="(item, i) in project.section_statistics" :key="i" :class="`card ${item.type}`">
            <template v-if="item.type=='big-number'">
              <p v-if="item.statistic" class="statistic">
                {{ item.statistic }}
              </p>
              <p v-if="item.description" class="description">
                {{ item.description }}
              </p>
            </template>
            <template v-else-if="item.type=='case-study'">
              <p v-if="item.title" class="title">
                {{ item.title }}
              </p>
              <p v-if="item.description" class="description">
                {{ item.description }}
              </p>
              <a v-if="item.link" class="cta" href="item.link.url" target="_blank">
                {{ item.link.text }}
              </a>
            </template>
          </div>
        </section>
      </div>

    </div>

    <div class="grid">
      <div class="col-5">
        <section v-if="project.section_key_info" id="section-key-info">
          <h3 class="heading">
            {{ project.section_key_info.heading }}
          </h3>

          <dl v-if="project.section_key_info.values" class="values">
            <template v-for="(item, i) in project.section_key_info.values">
              <dt :key="`key-${i}`" class="name">
                {{ item.name }}
              </dt>

              <dd v-if="item.type == 'links'" :key="`val-${i}`">
                <ul class="links">
                  <li v-for="(link, j) in item.value" :key="j">
                    <a href="link" target="_blank">
                      {{ $truncateString(link, 12, '...', type = 'double') }}
                    </a>
                    <div v-if="link.length > 23" class="link-tooltip" :data-tooltip="link" data-tooltip-theme="dark">
                      ?
                    </div>
                  </li>
                </ul>
              </dd>
              
              <dd v-else :key="`val-${i}`" class="text">
                {{ item.value }}
              </dd>
            </template>
          </dl>
        </section>

        <section v-if="project.section_video.url" id="section-video">
          <div class="video-wrapper">
            <iframe
              :src="$buildVideoEmbedUrl($parseVideoUrl(project.section_video.url))"
              class="video"
              allow="autoplay; encrypted-media"
              allowfullscreen>
            </iframe>
          </div>
        </section>

      </div>

      <div class="col-6" data-push-left="off-1">
        <section v-if="project.section_filters" id="section-filters">
          <Accordion
            v-slot="{ active }"
            :multiple="true">
            <AccordionSection
              v-for="(filterGroup, i) in project.section_filters.filters"
              :key="i"
              :active="active"
              :selected="true"
              class="filters">
              <AccordionHeader>
                <h3 class="heading">
                  {{ filterGroup.title }}
                </h3>
              </AccordionHeader>
              <AccordionContent>
                <div class="chicklet-container">
                  <button v-for="(filter, j) in filterGroup.filters" :key="j" class="chicklet">
                    {{ filter }}
                  </button>
                </div>
              </AccordionContent>
            </AccordionSection>
          </Accordion>
        </section>
      </div>
    </div>

    <section v-if="project.section_featured_slider" id="section-featured-slider">
      <div class="grid-center">

        <div class="col-12">
          <h3 v-if="project.section_featured_slider.heading" class="heading">
            {{ project.section_featured_slider.heading }}
          </h3>
          <div v-if="project.section_featured_slider.description" class="description">
            {{ project.section_featured_slider.description }}
          </div>
        </div>

        <div class="col-11">
          <FeaturedProjectsSlider />
        </div>

      </div>
    </section>

    <!-- <div class="grid">
      <div class="col">
        <pre><code>{{ project }}</code></pre>
      </div>
    </div> -->

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
    // Project Content
    project () {
      const siteContent = this.siteContent
      const id = this.id
      return siteContent.hasOwnProperty(id) ? siteContent[id] : false
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

  .chicklet-container {
    padding-bottom: 40px;
    display: flex;
    flex-wrap: wrap;
    row-gap: 12px;
    column-gap: 10px;
  }

  .chicklet {
    background: $blackHaze;
    border-radius: 5px;
    font-size: 12px;
    padding: 5px 14px;
  }
}

#section-featured-slider {
  margin-top: 95px;
}
</style>
