const showdown  = require('showdown')
const fs = require('fs')
const { BUILD_DIR, SRC_DIR } = require('./build.config')

// build paths
const WEBSITE_INDEX_BUILD_PATH = `${BUILD_DIR}/index.html`
const WEBSITE_404_BUILD_PATH = `${BUILD_DIR}/404.html`
const RESUME_BUILD_PATH = `${BUILD_DIR}/resume`

const TEMPLATES_DIR = `${SRC_DIR}/templates`
const BASE_TEMPLATE_PATH = `${TEMPLATES_DIR}/base.html`

// website paths
const WEBSITE_CONTENT_DIR = `${SRC_DIR}/content`
const WEBSITE_INDEX_HTML_PATH = `${TEMPLATES_DIR}/index.html`
const WEBSITE_404_HTML_PATH = `${TEMPLATES_DIR}/404.html`
const WEBSITE_SHORTCUT_HTML_PATH = `${TEMPLATES_DIR}/shortcut.html`
const WEBSITE_WINDOW_HTML_PATH = `${TEMPLATES_DIR}/window.html`

// resume paths
const RESUMES_SRC_DIR = `${SRC_DIR}/resumes`

const WATCHABLE_DIRS = [
    WEBSITE_CONTENT_DIR,
    RESUMES_SRC_DIR,
    TEMPLATES_DIR,
]

const buildHtml = (options) => {
    const { verbose } = options || {}

    const logMsgForce = console.log
    const logMsg = verbose ? logMsgForce : () => null

    const failBuild = msg => {
        throw new Error(msg)
    }

    // clear out build directory and create empty build files
    fs.mkdirSync(BUILD_DIR, { recursive: true })
    fs.mkdirSync(RESUME_BUILD_PATH, { recursive: true })

    const mdConverter = new showdown.Converter({ 
        metadata: true,
        tables: true,
        parseImgDimensions: true,
        emoji: true,
    })

    const getBuildableFilePaths = dirPath => {
        const fileNames = fs.readdirSync(dirPath)
        if (!fileNames || fileNames.length < 1) {
            return failBuild(`error reading files from ${dirPath}`)
        }
        return fileNames.filter(fileName => !fileName.startsWith('_'))
    }

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
        logMsg(`writing ${buildPath}`)
        let contents = templatePath

        if (data) {
            const template = fs.readFileSync(templatePath).toString()
            contents = renderHtml(template, data)  
        }

        const html = renderHtml(baseTemplate, { contents })
        fs.writeFileSync(buildPath, html)
    }
    const buildMdFileToHtml = (mdPath, logIndent = '') => {
        logMsg(`${logIndent}building '${mdPath}'`)
        const markdown = fs.readFileSync(mdPath).toString()
        let body = mdConverter.makeHtml(markdown)
        const { importMd, ...metadata } = mdConverter.getMetadata() || {} // must run after .makeHtml()
    
        if (importMd) {
            const cleanImportMd = importMd.replaceAll(' ', '')
            const importPairs = cleanImportMd.indexOf(',') > -1 
                ? cleanImportMd.split(',') 
                : [cleanImportMd]
            body = importPairs.reduce((html, pair) => {
                if (!pair) {
                    return html
                }
                const [key, path] = pair.split('=')
                const [importHtml] = buildMdFileToHtml(`${SRC_DIR}/${path}`, `  ${logIndent}`)
                return html.replace(`{{${key}}}`, importHtml)
            }, body)
        }

        return [body, metadata]
    }

    // ACTUAL BUILD

    logMsg('WEBSITE')

    const shortcutTemplate = fs.readFileSync(WEBSITE_SHORTCUT_HTML_PATH).toString()
    const windowTemplate = fs.readFileSync(WEBSITE_WINDOW_HTML_PATH).toString()

    const { shortcuts, windows } = getBuildableFilePaths(WEBSITE_CONTENT_DIR).reduce(
        (content, mdFileName) => {
            const id = mdFileName.replace('.md', '')
            const [body, metadata] = buildMdFileToHtml(`${WEBSITE_CONTENT_DIR}/${mdFileName}`)
            const { title, iconUrl, cssClass } = {
                title: ' ',
                iconUrl: null,
                cssClass: ' ',
                ...metadata
            }

            return {
                shortcuts: [
                    ...content.shortcuts,
                    renderHtml(shortcutTemplate, {
                        id,
                        iconUrl,
                        title,
                    })
                ],
                windows: [
                    ...content.windows,
                    renderHtml(windowTemplate, {
                        id,
                        title,
                        body,
                        cssClass,
                    })
                ]
            }
        }, 
        {
            shortcuts: [],
            windows: [],
        }
    )

    renderAndWritePage(WEBSITE_INDEX_BUILD_PATH, WEBSITE_INDEX_HTML_PATH, {
        shortcuts: shortcuts.join(''),
        windows: windows.join(''),
    })
    renderAndWritePage(WEBSITE_404_BUILD_PATH, WEBSITE_404_HTML_PATH, {
        htmlRenderDate: new Date(),
    })

    logMsg('\nRESUMES')

    getBuildableFilePaths(RESUMES_SRC_DIR).forEach(resumeName => {
        const resumeId = resumeName.replace('.md', '')
        const resumeSrc = `${RESUMES_SRC_DIR}/${resumeName}`
        const resumeDest = `${RESUME_BUILD_PATH}/${resumeId}.html`
        const [resumeHtml] = buildMdFileToHtml(resumeSrc)
        renderAndWritePage(resumeDest, resumeHtml)
    })
}

module.exports = {
    buildHtml,
    BUILD_DIR,
    WATCHABLE_DIRS,
}