// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Fs = require('fs-extra')

const paths = {
  projects: `content/projects`,
  taxonomies: `static/content/core_taxonomy.json`,
  project_routes: `static/content/project-routes.json`,
  project_list: `static/content/project-list.json`,
  showcase_data: `static/content/showcase-data.json`
}

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
/*
  Grab the project list and generate an array of slugs based on project filenames
*/
const compilePaths = (instance) => {
  const appRootDir = instance.options.rootDir
  return new Promise((next) => {
    Object.keys(paths).map((key) => {
      paths[key] = `${appRootDir}/${paths[key]}`
    })
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
const generateProjectManifestFiles = async (slugs) => {
  try {
    const len = slugs.length
    if (len === 0) { throw new Error('[manifestor.js] Unable to generate Project files because no projects exist') }
    const taxonomies = JSON.parse(await Fs.readFileSync(paths.taxonomies))
    const payload = {
      full: [],
      mini: [],
      showcase: { taxonomies: await reformatTaxonomies(taxonomies), projects: [] },
      routes: []
    }
    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      const tags = {}
      await compileTags(project, taxonomies.categories, tags)
      project.slug = slug
      payload.full.push(project)
      payload.mini.push({
        slug,
        name: project.name,
        logo: project.logo,
        description: project.description,
        org: project.org
      })
      payload.showcase.projects.push({
        name: project.name,
        logo: project.logo.icon,
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

// ////////////////////////////////////////////////////////////////// Manifestor
// -----------------------------------------------------------------------------
const Manifestor = async (instance) => {
  try {
    console.log('🚀️ Manifest projects started')
    await compilePaths(instance)
    console.log(paths)
    const slugs = await getSlugs()
    const payload = await generateProjectManifestFiles(slugs)
    await Fs.writeFileSync(paths.project_routes, JSON.stringify(payload.routes))
    await Fs.writeFileSync(paths.project_list, JSON.stringify(payload.full))
    await Fs.writeFileSync(paths.showcase_data, JSON.stringify(payload.showcase))
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
}

export default Manifestor
