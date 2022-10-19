/**
 *
 * [Script] Airtable Fetch
 *
 */

// ///////////////////////////////////////////////////// Imports + general setup
// -----------------------------------------------------------------------------
const Airtable = require('airtable')
const Path = require('path')
const Fs = require('fs-extra')
const Buffer = require('node:buffer')
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
      .select({ view: 'submissions-to-be-published' })
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

// ------------------------------------------------------ writeProjectFileToDisk
const writeProjectFileToDisk = async (record) => {
  try {
    await Fs.writeFile(
      `${PROJECT_DIR_PATH}/${record.file}.json`,
      JSON.stringify(JSON.parse(record.json), null)
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
    // data.pipe(writeableStream)
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
    const savePath = `${IMAGE_DIR_PATH}/${prefix}-${recordName}.${fileExt}`
    await downloadImage(recordName, imageData, savePath, imageType, fileExt)
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

// ////////////////////////////////////////////////////////////////// Initialize
// -----------------------------------------------------------------------------
const AirtableFetch = async () => {
  console.log('🤖 Airtable fetch started', '\n')
  try {
    const records = await getAirtableRecords()
    const count = records.length
    await diffAmountDeleted(count)
    await deleteAllLocalRecords()
    for (let i = 0; i < count; i++) {
      const record = records[i].fields
      const success = await writeProjectFileToDisk(record)
      if (!success) { continue }
      const icons = record['Icon (square)']
      const logos = record['Logo (non-square)']
      if (icons) {
        await isIconSquare(icons[0], record.file)
        await fetchAndProcessImage(record.file, icons[0], 'icon-square')
      }
      if (logos) {
        await fetchAndProcessImage(record.file, logos[0], 'logo')
      }
    }
    console.log('\n')
    console.log('🏁 Airtable fetch complete')
    process.exit(0)
  } catch (e) {
    console.log('=================================== [function: AirtableFetch]')
    console.log(e)
    process.exit(0)
  }
}; AirtableFetch()
