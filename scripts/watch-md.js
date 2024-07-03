const fs = require('fs')
const { buildHtml, WATCHABLE_DIRS } = require('./build-html')

// build first then watch
buildHtml()

const watchOptions = {}
WATCHABLE_DIRS.forEach(dirPath => {
    fs.watch(dirPath, watchOptions, buildHtml)
})
