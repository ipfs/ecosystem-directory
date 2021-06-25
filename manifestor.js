// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Fs = require('fs-extra')

const paths = {
  data: `${__dirname}/content/data`,
  embeddable_view: `${__dirname}/content/embeddable-view`,
  projects: `${__dirname}/content/projects`,
  manifest: `${__dirname}/content/data/project-manifest.json`,
  embeddable_view_script: `${__dirname}/static/embeddable-view.js`
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
  - Open and parse all project JSON files
  - Push all of them into an array with some information removed (to be used by embedable-view.js)
  - Write to a JSON file
*/
const generateProjectListFile = async (slugs) => {
  try {
    const len = slugs.length
    let compiled = []
    let activeFilters = []
    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      const industry = project.taxonomies.filter(taxonomy => taxonomy.slug === 'industry')
      const filters = industry.length && industry[0].tags ? industry[0].tags : []
      compiled.push({
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
        if (activeFilters.indexOf(filter) < 0) activeFilters.push(filter)
      })
    }
    return { data: compiled, activeFilters }
  } catch (e) {
    console.log('============================= [generateProjectListFile] Error')
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
      if (activeFilters.indexOf(tags[i].slug) > -1)
        compiled.push({
          label: tags[i].label,
          value: tags[i].slug
        })
    }
    return compiled
  } catch (e) {
    console.log('============================= [generateProjectListFile] Error')
    throw e
  }
}


/*
  - Generate Embeddable View File
*/
const generateEmbeddableViewFile = async (slugs) => {
  try {
    const projectList = await generateProjectListFile(slugs)
    const taxonomyList = await generateTaxonomyListFile('industry', projectList.activeFilters)
    const embeddableCSS = await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view.min.css`, 'utf8')
    const vueJS = await Fs.readFileSync(`${paths.embeddable_view}/vue.2.6.14.min.js`, 'utf8')
    let embeddableView = await Fs.readFileSync(`${paths.embeddable_view}/embeddable-view.js`, 'utf8')

    embeddableView = embeddableView.replace('INJECT_PROJECTS_LIST', JSON.stringify(projectList.data))
    embeddableView = embeddableView.replace('INJECT_FILTERS', JSON.stringify(taxonomyList))
    embeddableView = embeddableView.replace('INJECT_PROJECTS_STYLES', embeddableCSS)
    embeddableView = embeddableView.replace('INJECT_VUE_SCRIPT', vueJS)

    return embeddableView
  } catch (e) {
    console.log('============================= [generateProjectListFile] Error')
    throw e
  }
}
// ////////////////////////////////////////////////////////////////// Manifestor
// -----------------------------------------------------------------------------
const Manifestor = async () => {
  try {
    console.log('🚀️ Manifest projects started')
    const slugs = await getSlugs()
    await Fs.writeFileSync(paths.manifest, JSON.stringify(slugs))
    // const projectList = await generateProjectListFile(slugs)
    // await Fs.writeFileSync(paths.project_list, JSON.stringify(projectList.data))
    // const taxonomyList = await generateTaxonomyListFile('industry', projectList.activeFilters)
    // await Fs.writeFileSync(paths.taxonomy_list, JSON.stringify(taxonomyList))
    const embeddableViewScript = await generateEmbeddableViewFile(slugs)
    await Fs.writeFileSync(paths.embeddable_view_script, embeddableViewScript)
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
  process.exit(0)
}; Manifestor()
