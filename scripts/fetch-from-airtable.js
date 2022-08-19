var Airtable = require('airtable')
var kebabCase = require('lodash.kebabcase')
const path = require('path')
const fs = require('fs/promises')

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
      for (const record of records) {
        await saveSubmission(record)
      }

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

function getProjectJsonPath(fileName) {
  return path.join(__dirname, '../content/projects/', `${fileName}.json`)
}

async function exists(path) {
  return (await fs.stat(path)).isFile()
}
