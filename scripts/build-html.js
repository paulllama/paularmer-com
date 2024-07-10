const showdown  = require('showdown')
const fs = require('fs')
const { BUILD_DIR, SRC_DIR } = require('./build.config')

const WEBSITE_404_BUILD_PATH = `${BUILD_DIR}/404.html`
const RESUME_BUILD_PATH = `${BUILD_DIR}/resume`

const TEMPLATES_DIR = `${SRC_DIR}/templates`
const BASE_TEMPLATE_PATH = `${TEMPLATES_DIR}/base.html`
const RESUME_TEMPLATE_PATH = `${TEMPLATES_DIR}/resume.html`
const WEBSITE_CONTENT_DIR = `${SRC_DIR}/content`
const WEBSITE_404_HTML_PATH = `${TEMPLATES_DIR}/404.html`
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

    const renderAndWritePage = (buildPath, contents, template) => {
        logMsg(`writing ${buildPath}`)
        const html = renderHtml(template, { 
            htmlRenderDate: new Date(),
            contents,
         })
        fs.writeFileSync(buildPath, html)
    }

    const buildMdFileToHtml = (mdPath, logIndent = '') => {
        logMsg(`${logIndent}building '${mdPath}'`)
        const markdown = fs.readFileSync(mdPath).toString()
        let body = mdConverter.makeHtml(markdown)
        const { importMd } = mdConverter.getMetadata() || {} // must run after .makeHtml()
    
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
                const importHtml = buildMdFileToHtml(`${SRC_DIR}/${path}`, `  ${logIndent}`)
                return html.replace(`{{${key}}}`, importHtml)
            }, body)
        }

        return body
    }

    const buildMdFilesInDir = (srcDir, buildDir, template) => {
        const allFileNames = fs.readdirSync(srcDir)
        if (!allFileNames || allFileNames.length < 1) {
            return failBuild(`error reading files from ${srcDir}`)
        }
        allFileNames.filter(fn => !fn.startsWith('_')).forEach(fileName => {
            const fileId = fileName.replace('.md', '')
            const fileSrc = `${srcDir}/${fileName}`
            const fileDest = `${buildDir}/${fileId}.html`
            const fileHtml = buildMdFileToHtml(fileSrc, '\t')
            renderAndWritePage(fileDest, fileHtml, template)
        })
    }

    logMsg('WEBSITE')
    const baseTemplate = fs.readFileSync(BASE_TEMPLATE_PATH).toString()
    buildMdFilesInDir(WEBSITE_CONTENT_DIR, BUILD_DIR, baseTemplate)
    renderAndWritePage(WEBSITE_404_BUILD_PATH, WEBSITE_404_HTML_PATH, baseTemplate)

    logMsg('\nRESUMES')
    const resumeTemplate = fs.readFileSync(RESUME_TEMPLATE_PATH).toString()
    buildMdFilesInDir(RESUMES_SRC_DIR, RESUME_BUILD_PATH, resumeTemplate)
}

module.exports = {
    buildHtml,
    BUILD_DIR,
    WATCHABLE_DIRS,
}