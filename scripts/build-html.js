const showdown  = require('showdown')
const fs = require('fs')

const BUILD_DIR = './build'
const INDEX_BUILD_PATH = `${BUILD_DIR}/index.html`
const RESUME_BUILD_PATH = `${BUILD_DIR}/resume.html`
const MARKDOWN_DIR = './src/markdown'
const INDEX_MARKDOWN_DIR = `${MARKDOWN_DIR}/index`
const RESUME_MARKDOWN_INDEX = `${MARKDOWN_DIR}/resume/index.md`
const TEMPLATE_DIR = './src/templates'
const BASE_TEMPLATE_PATH = `${TEMPLATE_DIR}/base.html`
const INDEX_TEMPLATE_PATH = `${TEMPLATE_DIR}/index.html`
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

    const mdConverter = new showdown.Converter({ 
        metadata: true,
        tables: true,
        parseImgDimensions: true,
        emoji: true,
    })
    const shortcutTemplate = fs.readFileSync(SHORTCUT_TEMPLATE_PATH).toString()
    const windowTemplate = fs.readFileSync(WINDOW_TEMPLATE_PATH).toString()

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
    const renderAndWritePage = (buildPath, templatePath, data) => {
        let contents = templatePath

        if (data) {
            const template = fs.readFileSync(templatePath).toString()
            contents = renderHtml(template, data)  
        }

        const html = renderHtml(baseTemplate, { contents })
        fs.writeFileSync(buildPath, html)
        logMsgForce(`wrote to ${buildPath}`)
    }
    const buildMdFileToHtml = mdPath => {
        logMsg(`\t${mdPath}`)
        const markdown = fs.readFileSync(mdPath).toString()
        let body = mdConverter.makeHtml(markdown)
        const { importMd, ...metadata } = mdConverter.getMetadata() || {} // must run after .makeHtml()
    
        if (importMd) {
            const cleanImportMd = importMd.replaceAll(' ', '')
            const importPairs = cleanImportMd.indexOf(',') > -1 
                ? cleanImportMd.split(',') 
                : [cleanImportMd]
            body = importPairs.reduce((html, pair) => {
                const [key, path] = pair.split('=')
                const [importHtml] = buildMdFileToHtml(`${MARKDOWN_DIR}/${path}`)
                return html.replace(`{{${key}}}`, importHtml)
            }, body)
        }

        return [body, metadata]
    }

    logMsg('building index.html')

    logMsg('  finding markdown files')
    const markdownFileNames = fs.readdirSync(INDEX_MARKDOWN_DIR)
    if (!markdownFileNames || markdownFileNames.length < 1) {
        logErr('error reading markdown files')
        return -1
    }
    const shortcuts = []
    const windows = []
    markdownFileNames.forEach(markdownFileName => {
        const id = markdownFileName.replace('.md', '')
        const [body, metadata] = buildMdFileToHtml(`${INDEX_MARKDOWN_DIR}/${markdownFileName}`)
        const { title, iconUrl, cssClass } = metadata

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
    renderAndWritePage(INDEX_BUILD_PATH, INDEX_TEMPLATE_PATH, {
        shortcuts: shortcuts.join('\n'),
        windows: windows.join('\n'),
    })

    logMsg('building resume.html')
    const [resumeHtml] = buildMdFileToHtml(RESUME_MARKDOWN_INDEX)
    renderAndWritePage(RESUME_BUILD_PATH, resumeHtml)
}

module.exports = {
    buildHtml,
    MARKDOWN_DIR,
    TEMPLATE_DIR,
}