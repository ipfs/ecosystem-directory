// ///////////////////////////////////////////////////////// Imports & Variables
// -----------------------------------------------------------------------------
const Fs = require('fs-extra')

const { SetProjectDefaults } = require('./plugins/global-methods')

const paths = {
  data: `${__dirname}/content/data`,
  projects: `${__dirname}/content/projects`,
  manifest: `${__dirname}/content/data/project-manifest.json`,
  showcase_data: `${__dirname}/content/data/showcase-data.json`,
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

/*
  - Open and parse all project JSON files
  - Push all of them into an array (to be used by main app)
  - Push all of them into an array with some information removed (to be used by embedable-view.js)
  - Write to a JSON file
*/
const generateProjectListFiles = async (slugs) => {
  try {
    const len = slugs.length
    const payload = {
      full: [],
      mini: []
    }
    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      project.slug = slug
      payload.full.push(SetProjectDefaults(project))
      payload.mini.push({
        slug,
        name: project.name,
        logo: project.logo,
        description: project.description,
        org: project.org
      })
    }
    return payload
  } catch (e) {
    console.log('============================ [generateProjectListFiles] Error')
    throw e
  }
}

const generateShowcaseDataFile = async (slugs) => {
  try {
    const taxonomies = JSON.parse(await Fs.readFileSync(`${paths.data}/taxonomy.json`))
    const data = { taxonomies: {}, projects: [] }
    const len = slugs.length

    taxonomies.categories.forEach(category => {
      const tags = {}
      category.tags.forEach(tag => {
        tags[tag.slug] = tag.label
      })

      data.taxonomies[category.slug] = {
        label: category.label,
        tags
      }
    })

    for (let i = 0; i < len; i++) {
      const slug = slugs[i]
      const project = JSON.parse(await Fs.readFileSync(`${paths.projects}/${slug}.json`))
      const tags = {}

      project.taxonomies.forEach(tax => {
        const category = taxonomies.categories.filter(cat => cat.slug === tax.slug)

        if(!category.length || !category[0].tags) return

        tags[tax.slug] = tax.tags.filter(
          tag => category[0].tags.map(t => t.slug).includes(tag)
        )
      })

      data.projects.push({
        name: project.name,
        logo: project.logo.icon,
        tags: tags
      })
    }
    return data
  } catch (e) {
    console.log('============================= [generateShowcaseDataFile] Error')
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
    const payload = await generateProjectListFiles(slugs)
    const showcaseData = await generateShowcaseDataFile(slugs)
    await Fs.writeFileSync(paths.showcase_data, JSON.stringify(showcaseData))
    await Fs.writeFileSync(paths.project_list_full, JSON.stringify(payload.full))
    await Fs.writeFileSync(paths.project_list_mini, JSON.stringify(payload.mini))
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
  process.exit(0)
}; Manifestor()
