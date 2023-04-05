const showdown  = require('showdown')
const fs = require('fs')

const BUILD_DEST = './build/index.html'
const MARKDOWN_DIR = './src/markdown'
const TEMPLATE_DIR = './src/templates'
const SHORTCUT_TEMPLATE_PATH = `${TEMPLATE_DIR}/shortcut.html`
const WINDOW_TEMPLATE_PATH = `${TEMPLATE_DIR}/window.html`
const INDEX_TEMPLATE_PATH = `${TEMPLATE_DIR}/index.html`

const markdownFileNames = fs.readdirSync(MARKDOWN_DIR)
if (!markdownFileNames || markdownFileNames.length < 1) {
    console.log('Error reading markdown files')
    return -1
}

const mdConverter = new showdown.Converter({ 
    metadata: true,
    tables: true,
})
const shortcutTemplate = fs.readFileSync(SHORTCUT_TEMPLATE_PATH).toString()
const windowTemplate = fs.readFileSync(WINDOW_TEMPLATE_PATH).toString()

const shortcuts = []
const windows = []

markdownFileNames.forEach(markdownFileName => {
    console.log(markdownFileName)
    
    const markdown = fs.readFileSync(`${MARKDOWN_DIR}/${markdownFileName}`).toString()
    const body = mdConverter.makeHtml(markdown)
    const metadata = mdConverter.getMetadata() // must get run after .makeHtml()

    const title = metadata['title']
    const iconUrl = metadata['icon_url']
    const id = markdownFileName.replace('.md', '')

    const shortcutHtml = shortcutTemplate
        .replace('{{id}}', id)
        .replace('{{icon_url}}', iconUrl)
        .replace('{{title}}', title)
    const windowHtml = windowTemplate
        .replace('{{id}}', id)
        .replace('{{title}}', title)
        .replace('{{body}}', body)

    shortcuts.push(shortcutHtml)
    windows.push(windowHtml)
})

const indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH).toString()
const indexHtml = indexTemplate
    .replace('{{shortcuts}}', shortcuts.join('\n'))
    .replace('{{windows}}', windows.join('\n'))

fs.writeFileSync(BUILD_DEST, indexHtml)

