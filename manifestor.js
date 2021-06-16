const Fs = require('fs-extra')

const path = {
  projects: `${__dirname}/content/projects`,
  manifest: `${__dirname}/content/data/project-manifest.json`
}

const Manifestor = async () => {
  try {
    console.log('🚀️ Manifest projects started')
    const entities = await Fs.readdirSync(path.projects)
      .filter(entity => entity !== '.DS_Store')
      .map(entity => entity.split('.')[0])
    console.log(entities.join('\n'))
    await Fs.writeFileSync(path.manifest, JSON.stringify(entities))
    console.log('🏁 Manifest projects complete')
  } catch (e) {
    console.log('========================================== [Manifestor] Error')
    console.log(e)
  }
  process.exit(0)
}; Manifestor()
