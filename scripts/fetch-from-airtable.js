var Airtable = require('airtable')
var kebabCase = require('lodash.kebabcase')
const path = require('path')
const fs = require('fs')
const buffer = require('node:buffer')
const client = require('https')

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
        const currentProjectsFiles = fs.readdirSync(path.join(__dirname, '../content/projects/'))
        let activeProjectFiles = []
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
              const currentIcons = fs.readdirSync(path.join(__dirname, '../static/images/projects/'))
              let activeIcons = [] 
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
                downloadImage(record.fields['Icon (square)'][0].thumbnails.large.url, iconPath)
              }
              // delete any unused icons that are not in the airtable records
              // const inactiveIcons = currentIcons.filter( file => {
              //   return !activeIcons.includes(file)
              // })
              // inactiveIcons.forEach((fileName) => {
              //   deleteImageFile(fileName)
              // })
            } else {
              console.log(`There is no Icon (square) data for ${record.fields.file}`)
            } // end of icon logic
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

function downloadImage(url, path) {
  client.get(url, (res) => {
    res.on('data', (d) => {
      writeFile(path, d)
    })
  }).on('error', (e) => {
    console.error(e)
  })
}