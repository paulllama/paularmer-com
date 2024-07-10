const fs = require('fs')
const { buildHtml, WATCHABLE_DIRS } = require('./build-html')

const safeBuild = () => {
    try {
        buildHtml()
    } catch (e) {
        console.error(e)
    }
}

// build first then watch
safeBuild()

WATCHABLE_DIRS.forEach(dirPath => {
    console.log(`watching '${dirPath}'`)
    fs.watch(dirPath, {}, () => {
        console.log(`changes to '${dirPath}'`)
        safeBuild()
    })
})
