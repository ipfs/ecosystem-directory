const { watch } = require('fs')
const { exec } = require('child_process')

watch('content/embeddable-view', (eventType, filename) => {
  exec('node manifestor.js', (err, stdout, stderr) => {
    if (err) return console.error(`Error: ${err}`);
    console.info(`${filename} ${eventType}: Updated Manifestor`);
  })
})
