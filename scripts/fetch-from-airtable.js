/**
 *
 * [Script] Airtable Fetch
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const Path = require('path')
const Airtable = require('airtable')
const Fs = require('fs-extra')
const Axios = require('axios')
const Sharp = require('sharp')
const Mime = require('mime')

require('dotenv').config({ path: Path.resolve(__dirname, '../.env') })

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
})

const PROJECT_DIR_PATH = Path.resolve(__dirname, '../content/projects/')
const IMAGE_DIR_PATH = Path.resolve(__dirname, '../static/images/projects/')

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ---------------------------------------------------------- getAirtableRecords
const getAirtableRecords = () => {
  return new Promise((resolve) => {
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
    base('Main')
      .select({ filterByFormula: 'IF({Include in directory?} = TRUE(), TRUE(), FALSE())' })
      .eachPage((records, next) => {
        resolve(records)
      })
  })
}

// ----------------------------------------------------------- diffAmountDeleted
const diffAmountDeleted = async (count) => {
  try {
    let files = await Fs.readdir(PROJECT_DIR_PATH)
    files = files.filter(file => file !== '.DS_Store')
    if (count / files.length <= 0.75) {
      console.log('   ❗️ Greater than 25% of projects were deleted from the Airtable. Cancelling import.')
      process.exit(0)
    }
    return false
  } catch (e) {
    console.log('=============================== [function: diffAmountDeleted]')
    throw e
  }
}

// ------------------------------------------------------- deleteAllLocalRecords
const deleteAllLocalRecords = async (count) => {
  try {
    const projectFiles = await Fs.readdir(PROJECT_DIR_PATH)
    const imageFiles = await Fs.readdir(IMAGE_DIR_PATH)
    const files = projectFiles
      .map(file => `${PROJECT_DIR_PATH}/${file}`)
      .concat(
        imageFiles.map(file => `${IMAGE_DIR_PATH}/${file}`)
      )
    const len = files.length
    for (let i = 0; i < len; i++) {
      const path = files[i]
      if (Fs.existsSync(path)) {
        await Fs.unlink(path)
      }
    }
  } catch (e) {
    console.log('=========================== [function: deleteAllLocalRecords]')
    throw e
  }
}

// Strips http(s) to use // and let the client determine the protocol
const removeProtocol = (url) => {
  return url?.replace(/^https?:\/\//, '//')
}

// strip url of all protocol details and remove trailing slashes
const beautifyUrl = (url) => {
  return url?.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

// This function transforms the raw record data that was filled into the Airtable database into the format
// needed by the UI. A lot of the logic was copied from the Airtable utomation that would do this transformation 
// and populate the record.json field. 
// The target schema and return value of this should adhere to: https://github.com/ipfs-shipyard/nuxt-module-ecosystem-directory/blob/main/content/data/project-schema.json
// This is intended to replace and eliminate the Airtable transformation
const transformProject = (record, { iconFileName, logoFileName }) => {

  
  const file = record['Product/project name'].toLowerCase().replace(/[^a-zA-Z0-9\s\.]/gi, '').replace(/[\s\.]+/g, '-')
  const name = record['Product/project name']
  const org = record['Org/company name']
  const descShort = record['Short description']
  const descLong = record['Long description']
  const sortSince = record.Since
  const numOne = record['Big-number benefit 1']
  const numTwo = record['Big-number benefit 2']
  const numThree = record['Big-number benefit 3']
  const numOneValue = record['big-number-benefit-1-value']
  const numTwoValue = record['big-number-benefit-2-value']
  const numThreeValue = record['big-number-benefit-3-value']
  const ctaTitle = record['CTA card title']
  const ctaDesc = record['CTA card description']
  const ctaButton = record['CTA card button text']
  const featured = Boolean(record.featured)
  
  const linkWebsites = record.Website
  const linkRepos = record.Repo
  const video = record.Video
  const ctaLink = record['CTA card URL']

  const catIndustry = record["Industry"]
    ?.replace(/browsers/gi, "browsers")
    .replace(/content\sdelivery/gi, "content-delivery")
    .replace(/data\s\&\smachine\slearning/gi, "data-machine-learning")
    .replace(/data\sgovernance/gi, "data-governance")
    .replace(/data\spersistence/gi, "data-persistence")
    .replace(/defi/gi, "defi")
    .replace(/games\s\&\sVR\/AR/gi, "games-vr-ar")
    .replace(/identity/gi, "identity")
    .replace(/integrations/gi, "integrations")
    .replace(/iot/gi, "iot")
    .replace(/marketplaces\s\&\secommerce/gi, "marketplaces-ecommerce")
    .replace(/nfts/gi, "nfts")
    .replace(/other/gi, "other")
    .replace(/prediction/gi, "prediction")
    .replace(/social\smedia/gi, "social-media")

    const catFocusAreas = record["Focus areas"]?.map((el) => el
      .replace(/community\snetworks/gi, "community-networks")
      .replace(/developer\stools/gi, "dev-tools")
      .replace(/education/gi, "education")
      .replace(/file\ssharing/gi, "file-sharing")
      .replace(/glam/gi, "glam")
      .replace(/infrastructure/gi, "infrastructure")
      .replace(/medical\sdata/gi, "medical")
      .replace(/mobile/gi, "mobile")
      .replace(/music/gi, "music")
      .replace(/package\smanagers/gi, "package-managers")
      .replace(/public\sdata/gi, "public-data")
      .replace(/reputation\s\&\sip\smanagement/gi, "reputation-ip")
      .replace(/research\sdata/gi, "research-data")
      .replace(/storage\s&\spinning/gi, "storage-pinning")
      .replace(/streaming/gi, "streaming")
      .replace(/supply\schain/gi, "supply-chain")
      .replace(/video/gi, "video")
      .replace(/web\shosting\s\&\spublishing/gi, "web-hosting-publishing")
    )

    var catBenefits = record["IPFS benefits"]?.map((el) => el
      .replace(/corporate\s\&\sgovernment\sindependence/gi, "corporate-government-independence")
      .replace(/couldn\'t\sexist\swithout\sipfs/gi, "couldnt-exist-without-ipfs")
      .replace(/data\sintegrity\sand\sverifiability/gi, "data-integrity")
      .replace(/data\sintegrity/gi, "data-integrity")
      .replace(/disaster\sresilience/gi, "disaster-resilience")
      .replace(/interoperability/gi, "interoperability")
      .replace(/local\-first\smodel/gi, "local-first-model")
      .replace(/self\-sovereign\sdata/gi, "self-sovereign-data")
    )


    var catTooling = record["Tooling"]?.map((el) => el
      .replace(/kubo\s\(formerly\sgo-ipfs\)/gi, "go-ipfs")
      .replace(/bitswap/gi, "bitswap")
      .replace(/cljs\-ipfs/gi, "cljs-ipfs")
      .replace(/ecosystem\stools/gi, "ecosystem-tools")
      .replace(/filecoin/gi, "filecoin")
      .replace(/go\-ipfs/gi, "go-ipfs")
      .replace(/go\-libp2p/gi, "go-libp2p")
      .replace(/http\sgateway/gi, "http-gateway")
      .replace(/ipfs\scluster/gi, "ipfs-cluster")
      .replace(/ipfs\-embed/gi, "ipfs-embed")
      .replace(/ipld/gi, "ipld")
      .replace(/js\-ipfs/gi, "js-ipfs")
      .replace(/js\-ipfs\-https\-client/gi, "js-ipfs-https-client")
      .replace(/js\-libp2p/gi, "js-libp2p")
      .replace(/pinning\sservices/gi, "pinning-services")
      .replace(/py\-ipfs\-http\-client/gi, "py-ipfs-http-client")
      .replace(/rust\-libp2p/gi, "rust-libp2p")
    )

    

  const transformedProject = {
    name,
    file,
    display: true,
    featured,
    sortNumbers: {
      since: parseInt(sortSince),
    },
    logo: {
      // Duplicate image file across both fields, if only one exists
      icon: iconFileName ?? logoFileName,
      full: logoFileName ?? iconFileName,
    },
    org: [org],
    description: {
      short: descShort,
      long: descLong,
    },
    primaryCta: {
      url: removeProtocol(linkWebsites),
      text: 'Project Website',
    },
    links: [
      {
        label: 'Website',
        links: [
          {
            url: removeProtocol(linkWebsites),
            text: beautifyUrl(linkWebsites),
          },
        ],
      },
      {
        label: 'Repo',
        links: [
          {
            url: removeProtocol(linkRepos),
            text: beautifyUrl(linkRepos),
          },
        ],
      },
    ],
    keyInfo: [
      {
        label: 'Using IPFS since',
        value: sortSince,
      },
    ],
    video: removeProtocol(video),
    stats: [
      {
        label: numOne ?? "",
        value: numOneValue ?? "",
      },
      {
        label: numTwo ?? "",
        value: numTwoValue ?? "",
      },
      {
        label: numThree ?? "",
        value: numThreeValue ?? "",
      },
    ],
    ctaCard: {
      title: ctaTitle,
      description: ctaDesc,
      buttonText: ctaButton,
      url: removeProtocol(ctaLink),
    },
    taxonomies: [
      {
        slug: 'industry',
        tags: [catIndustry ?? ""],
      },
      {
        slug: 'focus',
        tags: catFocusAreas ?? [""],
      },
      {
        slug: 'benefits',
        tags: catBenefits ?? [""],
      },
      {
        slug: 'tooling',
        tags: catTooling ?? [""],
      },
    ],
  }

  return transformedProject
}

// ------------------------------------------------------ writeProjectFileToDisk
const writeProjectFileToDisk = async (transformedProject) => {
  try {
    await Fs.writeFile(
      `${PROJECT_DIR_PATH}/${transformedProject.file}.json`,
      JSON.stringify(transformedProject, null, 2)
    )
    return true
  } catch (e) {
    console.log(`   ❗️ [Bad JSON] project: ${record.file}`)
    return false
  }
}

// ----------------------------------------------------------------- resizeImage
const resizeImage = async (data, recordName, imageData, savePath, writeableStream, imageType) => { // imageType = 'icon-square' or 'logo'
  try {
    const width = imageData.width
    const height = imageData.height
    let transformer
    if (imageType === 'icon-square' && (width > 400 || height > 400)) {
      transformer = await Sharp().resize(400)
      data.pipe(transformer).pipe(writeableStream)
    } else if (imageType === 'logo' && (width > 1200 || height > 1200)) {
      transformer = await Sharp().resize(1200)
      data.pipe(transformer).pipe(writeableStream)
    } else {
      data.pipe(writeableStream)
    }
  } catch (e) {
    console.log(`   ❗️ [Image Resize Failed] ${recordName}`)
    throw e
  }
}

// --------------------------------------------------------------- downloadImage
const downloadImage = async (recordName, imageData, savePath, imageType, fileExt) => {
  const writeableStream = Fs.createWriteStream(savePath, { highWaterMark: 64000 })
  writeableStream.on('finish', () => writeableStream.close())
  writeableStream.on('error', (e) => {
    console.log('=========== [function: downloadImage | writeableStream error]')
    if (Fs.existsSync(savePath)) {
      Fs.unlink(savePath)
    }
  })
  try {
    const response = await Axios.get(imageData.url, { responseType: 'stream' })
    if (fileExt !== 'svg') {
      await resizeImage(response.data, recordName, imageData, savePath, writeableStream, imageType)
    } else {
      response.data.pipe(writeableStream)
    }
  } catch (e) {
    console.log(`   ❗️ [Image Download Failed] ${recordName}`)
    if (Fs.existsSync(savePath)) {
      Fs.unlink(savePath)
    }
  }
}

// -------------------------------------------------------- fetchAndProcessImage
const fetchAndProcessImage = async (recordName, imageData, imageType) => {
  try {
    const fileExt = Mime.getExtension(imageData.type)
    const prefix = imageType === 'icon-square' ? 'icon' : 'logo'
    const filename = `${prefix}-${recordName}.${fileExt}`
    const savePath = `${IMAGE_DIR_PATH}/${filename}`
    await downloadImage(recordName, imageData, savePath, imageType, fileExt)
    return filename
  } catch (e) {
    console.log('============================ [function: fetchAndProcessImage]')
    throw e
  }
}

// ---------------------------------------------------------------- isIconSquare
const isIconSquare = (imageData, iconName) => {
  return new Promise((resolve) => {
    if (imageData.width !== imageData.height) {
      console.log(`   📸 ${iconName} is not square`)
    }
    resolve()
  })
}

const verifyEnvVars = () => {
  if (!process.env.AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_BASE_ID env var is required')
  }

  if (!process.env.AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY env var is required')
  }
}

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const AirtableFetch = async () => {
  console.log('🤖 Airtable fetch started', '\n')
  try {
    verifyEnvVars()
    const records = await getAirtableRecords()
    const count = records.length
    await diffAmountDeleted(count)
    // await deleteAllLocalRecords()
    for (let i = 0; i < count; i++) {
      const record = records[i].fields
      const icons = record['Icon (square)']
      const logos = record['Logo (non-square)']

      let iconFileName, logoFileName
      if (icons) {
        await isIconSquare(icons[0], record.file)
        iconFileName = await fetchAndProcessImage(record.file, icons[0], 'icon-square')
      }
      if (logos) {
        logoFileName = await fetchAndProcessImage(record.file, logos[0], 'logo')
      }
      // Transform from Airtable representation to the directory's schema format
      const transformedProject = transformProject(record, { iconFileName, logoFileName })
      const success = await writeProjectFileToDisk(transformedProject)
    }
    console.log('\n')
    console.log('🏁 Airtable fetch complete')
    process.exit(0)
  } catch (e) {
    console.log('=================================== [function: AirtableFetch]')
    console.log(e)
    process.exit(0)
  }
}

AirtableFetch()
