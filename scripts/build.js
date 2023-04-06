const showdown  = require('showdown')
const fs = require('fs')

const BUILD_DIR = './build'
const BUILD_DEST = `${BUILD_DIR}/index.html`
const MARKDOWN_DIR = './src/markdown'
const TEMPLATE_DIR = './src/templates'
const SHORTCUT_TEMPLATE_PATH = `${TEMPLATE_DIR}/shortcut.html`
const WINDOW_TEMPLATE_PATH = `${TEMPLATE_DIR}/window.html`
const INDEX_TEMPLATE_PATH = `${TEMPLATE_DIR}/index.html`

fs.mkdirSync(BUILD_DIR, { recursive: true })
fs.openSync(BUILD_DEST, 'w')

const markdownFileNames = fs.readdirSync(MARKDOWN_DIR)
if (!markdownFileNames || markdownFileNames.length < 1) {
    console.log('Error reading markdown files')
    return -1
}

const mdConverter = new showdown.Converter({ 
    metadata: true,
    tables: true,
    parseImgDimensions: true,
})
const shortcutTemplate = fs.readFileSync(SHORTCUT_TEMPLATE_PATH).toString()
const windowTemplate = fs.readFileSync(WINDOW_TEMPLATE_PATH).toString()

const shortcuts = []
const windows = []

const renderHtml = (template, data) => {
    let renderedHtml = template

    for (const key in data) {
        const value = data[key]
        if (value) {
            renderedHtml = renderedHtml.replace(`{{${key}}}`, value)
        }
    }

    return renderedHtml
}

markdownFileNames.forEach(markdownFileName => {
    console.log(markdownFileName)
    
    const markdown = fs.readFileSync(`${MARKDOWN_DIR}/${markdownFileName}`).toString()
    const body = mdConverter.makeHtml(markdown)
    const metadata = mdConverter.getMetadata() // must get run after .makeHtml()

    const { title, iconUrl, cssClass } = metadata
    const id = markdownFileName.replace('.md', '')

    const shortcutHtml = renderHtml(shortcutTemplate, {
        id,
        iconUrl,
        title,
    })
    const windowHtml = renderHtml(windowTemplate, {
        id,
        title,
        body,
        cssClass,
    })

    shortcuts.push(shortcutHtml)
    windows.push(windowHtml)
})

const indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH).toString()
const indexHtml = renderHtml(indexTemplate, {
    shortcuts: shortcuts.join('\n'),
    windows: windows.join('\n'),
})

fs.writeFileSync(BUILD_DEST, indexHtml)

