// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Fs = require('fs-extra')

const { SetProjectDefaults } = require('./plugins/global-methods')

const paths = {
  data: `${__dirname}/content/data`,
  embeddable_view: `${__dirname}/content/embeddable-view`,
  projects: `${__dirname}/content/projects`,
  settings: `${__dirname}/content/data/settings.json`,
  manifest: `${__dirname}/content/data/project-manifest.json`,
  embeddable_view_script: `${__dirname}/static/embeddable-view.js`,
  project_list_full: `${__dirname}/content/data/project-list-full.json`, // ← to be used by main app
  project_list_mini: `${__dirname}/content/data/project-list-mini.json` // ← to be used by embedable-view.js
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

const getPrimaryCategory = async () => {
  try {
    return JSON.parse(await Fs.readFileSync(paths.settings)).behavior.primaryCategorySlug
  } catch (e) {
    console.log('================================== [getPrimaryCategory] Error')
    throw e
  }
}

/*
  - Open and parse all project JSON files
  - Push all of them into an array (to be used by main app)
  - Push all of them into an array with some information removed (to be used by embedable-view.js)
  - Write to a JSON file
*/
const generateProjectListFiles = async (primaryCategory, slugs) => {
  try {
    const len = slugs.length
    const payload = {
      full: [],
      mini: [],
      activeFilters: []
    }
    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      const filterItems = project.taxonomies.filter(taxonomy => taxonomy.slug === primaryCategory)
      const filters = filterItems.length && filterItems[0].tags ? filterItems[0].tags : []
      project.slug = slug
      payload.full.push(SetProjectDefaults(project))
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
    }
    return payload
  } catch (e) {
    console.log('============================ [generateProjectListFiles] Error')
    throw e
  }
}

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
    console.log('============================= [generateTaxonomyListFile] Error')
    throw e
  }
}


/*
  - Generate Embeddable View File
*/
const generateEmbeddableViewFile = async (projectList, activeFilters, primaryCategory, slugs) => {
  try {
    const settings = JSON.parse(await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view-settings.json`, 'utf8'))
    const taxonomyList = await generateTaxonomyListFile(primaryCategory, activeFilters)
    const embeddableCSS = await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view.min.css`, 'utf8')
    const vueJS = await Fs.readFileSync(`${paths.embeddable_view}/vue.2.6.14.min.js`, 'utf8')
    let embeddableView = await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view.js`, 'utf8')

    embeddableView = embeddableView.replace('INJECT_PROJECTS_LIST', JSON.stringify(projectList))
    embeddableView = embeddableView.replace('INJECT_FILTERS', JSON.stringify(taxonomyList))
    embeddableView = embeddableView.replace('INJECT_PROJECTS_STYLES', embeddableCSS)
    embeddableView = embeddableView.replace('INJECT_VUE_SCRIPT', vueJS)

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
    const primaryCategory = await getPrimaryCategory()
    const payload = await generateProjectListFiles(primaryCategory, slugs)
    const embeddableViewScript = await generateEmbeddableViewFile(payload.mini, payload.activeFilters, primaryCategory, slugs)
    await Fs.writeFileSync(paths.manifest, JSON.stringify(slugs))
    await Fs.writeFileSync(paths.embeddable_view_script, embeddableViewScript)
    await Fs.writeFileSync(paths.project_list_full, JSON.stringify(payload.full))
    await Fs.writeFileSync(paths.project_list_mini, JSON.stringify(payload.mini))
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
  process.exit(0)
}; Manifestor()
