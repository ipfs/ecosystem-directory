<template>
  <div :class="`page page-${tag} ${id} container`">

    <div class="grid">
      <div class="col">

        <h1 class="name">
          {{ name }}
        </h1>

        <div class="company">
          {{ company }}
        </div>

      </div>
    </div>

    <div class="grid">
      <div class="col">
        <pre><code>{{ project }}</code></pre>
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

// ====================================================================== Export
export default {
  name: 'ProjectSingularPage',

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
    // project
    project () {
      const siteContent = this.siteContent
      const id = this.id
      return siteContent.hasOwnProperty(id) ? siteContent[id] : false
    },
    name () {
      return this.project.name
    },
    company () {
      return this.project.company
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
</style>
