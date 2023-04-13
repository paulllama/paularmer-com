const showdown  = require('showdown')
const fs = require('fs')

const BUILD_DIR = './build'
const INDEX_BUILD_PATH = `${BUILD_DIR}/index.html`
const RESUME_BUILD_PATH = `${BUILD_DIR}/resume.html`
const MARKDOWN_DIR = './src/markdown'
const TEMPLATE_DIR = './src/templates'
const BASE_TEMPLATE_PATH = `${TEMPLATE_DIR}/base.html`
const INDEX_TEMPLATE_PATH = `${TEMPLATE_DIR}/index.html`
const RESUME_TEMPLATE_PATH = `${TEMPLATE_DIR}/resume.html`
const SHORTCUT_TEMPLATE_PATH = `${TEMPLATE_DIR}/shortcut.html`
const WINDOW_TEMPLATE_PATH = `${TEMPLATE_DIR}/window.html`

const buildHtml = (options) => {
    const { verbose } = options || {}

    const logMsgForce = console.log
    const logMsg = verbose ? logMsgForce : () => null
    const logErr = console.error

    // clear out build directory and create empty build files
    fs.mkdirSync(BUILD_DIR, { recursive: true })
    fs.openSync(INDEX_BUILD_PATH, 'w')
    fs.openSync(RESUME_BUILD_PATH, 'w')

    const markdownFileNames = fs.readdirSync(MARKDOWN_DIR)
    if (!markdownFileNames || markdownFileNames.length < 1) {
        logErr('Error reading markdown files')
        return -1
    }

    const mdConverter = new showdown.Converter({ 
        metadata: true,
        tables: true,
        parseImgDimensions: true,
        emoji: true,
    })
    const shortcutTemplate = fs.readFileSync(SHORTCUT_TEMPLATE_PATH).toString()
    const windowTemplate = fs.readFileSync(WINDOW_TEMPLATE_PATH).toString()

    const shortcuts = []
    const windows = []
    let jobHistory 

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

    const baseTemplate = fs.readFileSync(BASE_TEMPLATE_PATH).toString()
    const renderAndWritePage = (templatePath, buildPath, data) => {
        const template = fs.readFileSync(templatePath).toString()
        const contents = renderHtml(template, data)
        const html = renderHtml(baseTemplate, { contents })
        fs.writeFileSync(buildPath, html)
        logMsgForce(`Built ${buildPath}`)
    }

    logMsg('Finding markdown files...')
    markdownFileNames.forEach(markdownFileName => {
        logMsg(`\t${markdownFileName}`)
        
        const markdown = fs.readFileSync(`${MARKDOWN_DIR}/${markdownFileName}`).toString()
        const body = mdConverter.makeHtml(markdown)
        const metadata = mdConverter.getMetadata() // must run after .makeHtml()

        const { title, iconUrl, cssClass, isJobHistory } = metadata
        const id = markdownFileName.replace('.md', '')

        if (metadata && isJobHistory) {
            jobHistory = body.toString()
        }

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

    renderAndWritePage(INDEX_TEMPLATE_PATH, INDEX_BUILD_PATH, {
        shortcuts: shortcuts.join('\n'),
        windows: windows.join('\n'),
    })
    renderAndWritePage(RESUME_TEMPLATE_PATH, RESUME_BUILD_PATH, {
        jobHistory,
    })
}

module.exports = {
    buildHtml,
    MARKDOWN_DIR,
    TEMPLATE_DIR,
}