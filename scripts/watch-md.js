const fs = require('fs')
const { buildHtml, TEMPLATE_DIR, MARKDOWN_DIR } = require('./build-html')

const watchOptions = {
    recursive: true,
}
fs.watch(TEMPLATE_DIR, watchOptions, buildHtml)
fs.watch(MARKDOWN_DIR, watchOptions, buildHtml)
