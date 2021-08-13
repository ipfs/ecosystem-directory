// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Settings = require('./content/data/settings.json')

const Fs = require('fs-extra')

const { SetProjectDefaults } = require('./plugins/global-methods')

const paths = {
  data: `${__dirname}/content/data`,
  static: `${__dirname}/static`,
  embeddable_view: `${__dirname}/content/embeddable-view`,
  embeddable_view_script: `${__dirname}/static/embeddable-view.js`,
  projects: `${__dirname}/content/projects`,
  taxonomies: `${__dirname}/content/data/taxonomy.json`,
  project_routes: `${__dirname}/content/data/project-routes.json`,
  project_list: `${__dirname}/content/data/project-list.json`,
  showcase_data: `${__dirname}/content/data/showcase-data.json`
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/*
  Grab the project list and generate an array of slugs based on project filenames
*/
const getSlugs = async () => {
  try {
    const slugs = await Fs.readdirSync(paths.projects)
      .filter(obj => obj !== '.DS_Store')
      .map(obj => obj.split('.')[0])
      console.log(slugs.join('\n'))
    return slugs
  } catch (e) {
    console.log('============================================ [getSlugs] Error')
    throw e
  }
}

/*
  Convert taxonomies file to a different Object structure → for showcase-data.json
*/
const reformatTaxonomies = async (taxonomies) => {
  try {
    const compiled = {}
    taxonomies.categories.forEach((category) => {
      const tags = {}
      category.tags.forEach((tag) => {
        tags[tag.slug] = tag.label
      })
      compiled[category.slug] = {
        label: category.label,
        tags
      }
    })
    return compiled
  } catch (e) {
    console.log('============================= [reformatTaxonomies] Error')
    throw e
  }
}

/*
  Convert taxonomies file to a different Object structure → for static/embeddable-view.js
*/
const generateTaxonomyListFile = async (slug, activeFilters) => {
  try {
    const taxonomies = JSON.parse(await Fs.readFileSync(`${paths.data}/taxonomy.json`))
    const category = taxonomies.categories.filter(category => category.slug === slug)
    const tags = category.length && category[0] ? category[0].tags : []
    const len = tags.length
    const compiled = []
    for (let i = 0; i < len; i++) {
      if (activeFilters.indexOf(tags[i].slug) > -1) {
        compiled.push({
          label: tags[i].label,
          value: tags[i].slug
        })
      }
    }
    return compiled
  } catch (e) {
    console.log('============================ [generateTaxonomyListFile] Error')
    throw e
  }
}

/*
  Match taxonomy schema with project taxonomy → for showcase-data.json
*/
const compileTags = (project, categories, tags) => {
  return new Promise((next, reject) => {
    project.taxonomies.forEach((taxonomy) => {
      const category = categories.filter(category => category.slug === taxonomy.slug)
      if (category.length === 0 || !category[0].tags) { return }
      tags[taxonomy.slug] = taxonomy.tags.filter(
        tag => category[0].tags.map(t => t.slug).includes(tag)
      )
    })
    next()
  })
}

/*
  - Open and parse all project JSON files
  - Push all of them into an array (to be used by main app and nuxt.config.js routes/generate block)
  - Push all of them into an array with some information removed (to be used by embedable-view.js and the showcase view)
*/
const generateProjectManifestFiles = async (slugs, primaryCategory) => {
  try {
    const len = slugs.length
    if (len === 0) { throw new Error('[manifestor.js] Unable to generate Project files because no projects exist') }
    const taxonomies = JSON.parse(await Fs.readFileSync(paths.taxonomies))
    const payload = {
      full: [],
      mini: [],
      activeFilters: [],
      showcase: { taxonomies: await reformatTaxonomies(taxonomies), projects: [] },
      routes: []
    }
    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      const filterItems = project.taxonomies.filter(taxonomy => taxonomy.slug === primaryCategory)
      const filters = filterItems.length && filterItems[0].tags ? filterItems[0].tags : []
      const tags = {}
      await compileTags(project, taxonomies.categories, tags)
      SetProjectDefaults(project)
      project.slug = slug
      payload.full.push(project)
      payload.mini.push({
        slug,
        name: project.name,
        logo: project.logo,
        description: project.description,
        org: project.org,
        featured: project.featured,
        sortNumbers: project.sortNumbers,
        filters
      })
      filters.forEach(filter => {
        if (payload.activeFilters.indexOf(filter) < 0) {
          payload.activeFilters.push(filter)
        }
      })
      payload.showcase.projects.push({
        name: project.name,
        logo: project.logo.icon || project.logo.full,
        tags
      })
      payload.routes.push({
        route: `/project/${slug}`,
        payload: project
      })
    }
    return payload
  } catch (e) {
    console.log('======================== [generateProjectManifestFiles] Error')
    throw e
  }
}

/*
  Generate Embeddable View File
*/
const generateEmbeddableViewFile = async (projectList, activeFilters, primaryCategory, slugs) => {
  try {
    const settings = Settings.embeddable_view;
    const taxonomyList = await generateTaxonomyListFile(primaryCategory, activeFilters)
    const embeddableCSS = await Fs.readFileSync(`${paths.static}/embeddable-view.min.css`, 'utf8')
    const vueJS = await Fs.readFileSync(`${paths.embeddable_view}/vue.2.6.14.min.js`, 'utf8')
    let embeddableView = await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view.js`, 'utf8')
    // Inject content
    embeddableView = embeddableView.replace('INJECT_PROJECTS_LIST', JSON.stringify(projectList))
    embeddableView = embeddableView.replace('INJECT_FILTERS', JSON.stringify(taxonomyList))
    embeddableView = embeddableView.replace('INJECT_PROJECTS_STYLES', embeddableCSS)
    embeddableView = embeddableView.replace('INJECT_VUE_SCRIPT', vueJS)
    // Inject settings
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_HOST/g, settings.host)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_TARGET/g, settings.target)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_HEADING/g, settings.copy.heading)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_SUBHEADING/g, settings.copy.subheading)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_PROJECT_LINK/g, settings.copy.project_link)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_ECOSYSTEM_LINK/g, settings.copy.ecosystem_link)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_FILTER_ALL/g, settings.copy.filter_all)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_SORT_A_Z/g, settings.copy.sort_a_z)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_SORT_Z_A/g, settings.copy.sort_z_a)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_SORT_DATE_ASC/g, settings.copy.sort_date_asc)
    embeddableView = embeddableView.replace(/INJECT_SETTINGS_SORT_DATE_DESC/g, settings.copy.sort_date_desc)
    return embeddableView
  } catch (e) {
    console.log('========================== [generateEmbeddableViewFile] Error')
    throw e
  }
}

// ////////////////////////////////////////////////////////////////// Manifestor
// -----------------------------------------------------------------------------
const Manifestor = async () => {
  try {
    console.log('🚀️ Manifest projects started')
    const slugs = await getSlugs()
    const primaryCategory = Settings.behavior.primaryCategorySlug;
    const payload = await generateProjectManifestFiles(slugs, primaryCategory)
    await Fs.writeFileSync(paths.project_routes, JSON.stringify(payload.routes))
    await Fs.writeFileSync(paths.project_list, JSON.stringify(payload.full))
    await Fs.writeFileSync(paths.showcase_data, JSON.stringify(payload.showcase))
    if (Settings.visibility.embeddableObject) {
      const embeddableViewScript = await generateEmbeddableViewFile(payload.mini, payload.activeFilters, primaryCategory, slugs)
      await Fs.writeFileSync(paths.embeddable_view_script, embeddableViewScript)
    }
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
  process.exit(0)
}; Manifestor()
