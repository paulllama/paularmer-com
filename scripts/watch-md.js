const fs = require('fs')
const { buildHtml, WATCHABLE_DIRS } = require('./build-html')

// build first then watch
buildHtml()

WATCHABLE_DIRS.forEach(dirPath => {
    console.log(`watching '${dirPath}'`)
    fs.watch(dirPath, {}, () => {
        console.log(`changes to '${dirPath}'`)
        buildHtml()
    })
})
