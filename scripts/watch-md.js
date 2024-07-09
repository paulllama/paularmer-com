const fs = require('fs')
const { buildHtml, WATCHABLE_DIRS } = require('./build-html')

// build first then watch
buildHtml()

WATCHABLE_DIRS.forEach(dirPath => {
    fs.watch(dirPath, {}, buildHtml)
})
