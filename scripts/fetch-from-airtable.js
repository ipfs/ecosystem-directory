var Airtable = require('airtable')
var kebabCase = require('lodash.kebabcase')
const path = require('path')
const fs = require('fs')
const buffer = require('node:buffer')
const https = require('https')

require('dotenv').config()

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY,
})

var base = Airtable.base('appLWiIrg9SQaEtEq')

base('Main')
  .select({
    view: 'submissions-to-be-published',
  })
    .eachPage(
      async (records, next) => {
        // variables for json file cleanup
        const currentProjectsFiles = fs.readdirSync(path.join(__dirname, '../content/projects/'))
        let activeProjectFiles = []
        // variables for icon file cleanup
        const currentIcons = fs.readdirSync(path.join(__dirname, '../static/images/projects/'))
        let activeIcons = [] 
        // variables for logo file cleanup
        const currentLogos = fs.readdirSync(path.join(__dirname, '../static/images/projects/'))
        let activeLogos = [] 
        for (const record of records) {
          const jsonPath = getProjectJsonPath(record.fields.file)
          // check if the row gets included
          if (record.fields['Include in directory?']) {
            // check if the file already exists
            if (fs.existsSync(jsonPath)) {
              // compare data from api to filesystem and if not identical update files in system
              makeFilesIdentical(record.fields.json, jsonPath)
            } else {
              // if the file doesn't exist make it
              writeFile(jsonPath, record.fields.json)
            } 
            // add it to activeProjectFiles
            activeProjectFiles.push(`${record.fields.file}.json`)
            // PHOTO STUFF
            // check if there is an icon in the data
            if (record.fields['Icon (square)']) {
              let iconPath
              let iconName
              // write the icon file path
              switch(true) {
                case ( record.fields['Icon (square)'][0].type === 'image/png' ):
                  iconName = (`icon-${record.fields.file}.png`)
                  iconPath = getImagePath(iconName)
                  activeIcons.push(iconName)
                  isIconSquare(record.fields['Icon (square)'][0], iconName)
                  break
                case ( record.fields['Icon (square)'][0].type === 'image/svg+xml' ):
                  iconName = (`icon-${record.fields.file}.svg`)
                  iconPath = getImagePath(iconName)
                  activeIcons.push(iconName)
                  isIconSquare(record.fields['Icon (square)'][0], iconName)
                  break
                case ( record.fields['Icon (square)'][0].type === 'image/jpeg' ):
                  iconName = (`icon-${record.fields.file}.jpeg`)
                  iconPath = getImagePath(iconName)
                  activeIcons.push(iconName)
                  isIconSquare(record.fields['Icon (square)'][0], iconName)
                  break
                default:
                  console.log('Unknown icon file type: ', record.fields['Icon (square)'][0].type)
              } 
              // check if the icon already exists
              if (!fs.existsSync(iconPath)) {
                // if it doesn't exist download it
                downloadImage(record.fields['Icon (square)'][0].url, iconPath)
              }
              //delete any unused icons that are not in the airtable records
              const inactiveIcons = currentIcons.filter( file => {

                return !activeIcons.includes(file)
              })
              console.log("inactiveIcons ", inactiveIcons)
              // inactiveIcons.forEach((fileName) => {
              //   deleteImageFile(fileName)
              // })
            } else {
              console.log(`There is no Icon (square) data for ${record.fields.file}`)
            } // end of icon logic
            // check if there is a logo in the data
            if (record.fields['Logo (non-square)']) {
              let logoPath
              let logoName
              // write the logo file path
              switch(true) {
                case ( record.fields['Logo (non-square)'][0].type === 'image/png' ):
                  logoName = (`logo-${record.fields.file}.png`)
                  logoPath = getImagePath(logoName)
                  activeLogos.push(logoName)
                  break
                case ( record.fields['Logo (non-square)'][0].type === 'image/svg+xml' ):
                  logoName = (`logo-${record.fields.file}.svg`)
                  logoPath = getImagePath(logoName)
                  activeLogos.push(logoName)
                  break
                case ( record.fields['Logo (non-square)'][0].type === 'image/jpeg' ):
                  logoName = (`logo-${record.fields.file}.jpeg`)
                  logoPath = getImagePath(logoName)
                  activeLogos.push(logoName)
                  break
                default:
                  console.log('Unknown logo file type: ', record.fields['Logo (non-square)'][0].type)
              } 
              // check if the logo already exists
              if (!(fs.existsSync(logoPath))) {
                // if it doesn't exist download it
                downloadImage(record.fields['Logo (non-square)'][0].url, logoPath)
              }
              // delete any unused Logos that are not in the airtable records
              const inactiveLogos = currentLogos.filter( file => {
                  return !activeLogos.includes(file)
                })
              console.log("inactiveLogos ", inactiveLogos)
              // inactiveLogos.forEach((fileName) => {
              //   deleteImageFile(fileName)
              // })
            } else {
              console.log(`There is no Logo (non-square) data for ${record.fields.file}`)
            } // end of logo logic
          }
        } // end of interating over records
        // delete any existing files that are not in the airtable records
        const inactiveProjectFiles = currentProjectsFiles.filter( file => {
          return !activeProjectFiles.includes(file)
        })
        inactiveProjectFiles.forEach((fileName) => {
          deleteJsonFile(fileName)
        })
        next()
      },
      (err) => {
        if (err) {
          console.error(err)
          return
        }
      },
    )

async function saveSubmission(record) {
  const path = getProjectJsonPath(record.fields.file)
  let fd
  try {
    const json = JSON.stringify(JSON.parse(record.fields.json), null, '  ')
    fd = await fs.open(path, 'w')
    await fd.writeFile(json)
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(`bad json for record: ${record.fields.file}`, e)
      return
    }
    console.err(e)
  } finally {
    await fd?.close()
  }
}

function makeFilesIdentical(newFile, filePath) {
  if (!fs.readFileSync(filePath).equals(Buffer.from(newFile))) {
    writeFile(filePath, newFile)
  }
}

function getImagePath(fileName) {
  return path.join(__dirname, '../static/images/projects/', fileName)
}

function getProjectJsonPath(fileName) {
  // if the file name already has .json on the end don't add the extension to the path name
  return (fileName.match(/\.json/) ? path.join(__dirname, '../content/projects/', fileName) : path.join(__dirname, '../content/projects/', `${fileName}.json`))
}

function writeFile(path, data) {
  fs.writeFileSync(path, data, (err) => {if(err) throw err })
}

function deleteJsonFile(fileName) {
  fs.unlinkSync(getProjectJsonPath(fileName), (err) => {
    if (err) throw err })
  console.log(`Deleted ${fileName} from /content/projects/`)
}

function deleteImageFile(fileName) {
  fs.unlinkSync(getImagePath(fileName), (err) => {
    if (err) throw err })
  console.log(`Deleted ${fileName} from /static/images/projects/`)
}

function isIconSquare (imageData, iconName) {
  if (!imageData.width === imageData.height) {
    console.log(`${iconName} is not square`)
  }
}

function downloadFileToBuffer(url) {
  client.get(url, (res) => {
    return Buffer.from(res)
  })
}

function downloadImage (url, savePath) {
  const file = fs.createWriteStream(savePath)

  const request = https.get(url, (res) => {
      if (res.statusCode !== 200) {
          return console.log('Response status was ' + res.statusCode);
      }
      res.pipe(file)
  })
  file.on('finish', () => file.close())

  request.on('error', (err) => {
      fs.unlink(savePath, () => console.error(err.message))
  })

  file.on('error', (err) => {
      fs.unlink(savePath, () => console.error(err.message))
  })
}