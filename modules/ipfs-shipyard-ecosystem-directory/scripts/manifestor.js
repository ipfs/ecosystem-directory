// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Fs = require('fs-extra')
const Sass = require('node-sass')

const paths = {
  prefixed: false, // key to ensure path prefixing only happens once during compile
  projects: `content/projects`,
  staticDir: `static`,
  taxonomies: `static/content/core_taxonomy.json`,
  settings: `static/content/core_settings.json`,
  project_routes: `static/content/project-routes.json`,
  project_list: `static/content/project-list.json`,
  showcase_data: `static/content/showcase-data.json`
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/*
  Prefix paths with the application root directory
*/
const prefixPaths = (instance) => {
  const appRootDir = instance.options.rootDir
  return new Promise((next) => {
    if (!paths.prefixed) {
      Object.keys(paths).map((key) => {
        paths[key] = `${appRootDir}/${paths[key]}`
      })
      paths.prefixed = true
    }
    next()
  })
}

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
    const taxonomies = JSON.parse(await Fs.readFileSync(paths.taxonomies))
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
const generateProjectManifestFiles = async (slugs, primaryCategory, taxonomies) => {
  try {
    const len = slugs.length
    if (len === 0) { throw new Error('[manifestor.js] Unable to generate Project files because no projects exist') }
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
const generateEmbeddableViewFile = async (projectList, activeFilters, primaryCategory, slugs, settings) => {
  try {
    settings = settings.embeddable_view
    const taxonomyList = await generateTaxonomyListFile(primaryCategory, activeFilters)
    const compiledCSS = Sass.renderSync({
      file: `${__dirname}/../assets/scss/embeddable-view.scss`,
      outputStyle: 'compressed'
    }).css
    const vueJS = await Fs.readFileSync(`${__dirname}/../assets/js/vue.2.6.14.min.js`, 'utf8')
    let embeddableView = await Fs.readFileSync(`${__dirname}/../assets/js/embeddable-view.js`, 'utf8')
    // Inject content
    embeddableView = embeddableView.replace('INJECT_PROJECTS_LIST', JSON.stringify(projectList))
    embeddableView = embeddableView.replace('INJECT_FILTERS', JSON.stringify(taxonomyList))
    embeddableView = embeddableView.replace('INJECT_PROJECTS_STYLES', compiledCSS)
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
const Manifestor = async (instance) => {
  try {
    console.log('🚀️ Manifest projects started')
    await prefixPaths(instance)
    const slugs = await getSlugs()
    const settings = JSON.parse(Fs.readFileSync(paths.settings))
    const taxonomies = JSON.parse(await Fs.readFileSync(paths.taxonomies))
    const primaryCategory = settings.behavior.primaryCategorySlug
    const payload = await generateProjectManifestFiles(slugs, primaryCategory, taxonomies)
    await Fs.writeFileSync(paths.project_routes, JSON.stringify(payload.routes))
    await Fs.writeFileSync(paths.project_list, JSON.stringify(payload.full))
    await Fs.writeFileSync(paths.showcase_data, JSON.stringify(payload.showcase))
    if (settings.visibility.embeddableObject) {
      const embeddableViewScript = await generateEmbeddableViewFile(payload.mini, payload.activeFilters, primaryCategory, slugs, settings)
      await Fs.writeFileSync(`${paths.staticDir}/embeddable-view.js`, embeddableViewScript)
    }
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
}

export default Manifestor
