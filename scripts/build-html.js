const showdown  = require('showdown')
const fs = require('fs')
const { BUILD_DIR, SRC_DIR } = require('./build.config')

const RESUME_BUILD_PATH = `${BUILD_DIR}/resume`

const TEMPLATES_DIR = `${SRC_DIR}/templates`
const BASE_TEMPLATE_PATH = `${TEMPLATES_DIR}/base.html`
const WEBSITE_CONTENT_DIR = `${SRC_DIR}/content`
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

    const writeFile = (buildPath, contents) => {
        logMsg(`📝 ${buildPath}`)
        fs.writeFileSync(buildPath, contents)
    }

    const renderToHtml = (markdown) => {
        const body =  mdConverter.makeHtml(markdown)
        const meta = mdConverter.getMetadata() || {}
        return { body, meta }
    }
    const renderToMd = (markdown) => {
        if (markdown.indexOf('---') > -1) {
            mdConverter.makeHtml(markdown)
            return {
                body: markdown.split('---')[2].trim(),
                meta: mdConverter.getMetadata(),
            }
        }

        return {
            body: markdown.toString(),
            meta: {},
        }        
    }
    const renderMdFile = (render, mdPath, logIndent = '') => {
        logMsg(`${logIndent}🏗️ ${mdPath}`)
        const markdown = fs.readFileSync(mdPath).toString()
        const { body, meta } = render(markdown)
        const { importMd } = meta
    
        if (importMd) {
            const cleanImportMd = importMd.replaceAll(' ', '')
            const importPairs = cleanImportMd.indexOf(',') > -1 
                ? cleanImportMd.split(',') 
                : [cleanImportMd]
            return importPairs.reduce((html, pair) => {
                if (!pair) {
                    return html
                }
                const [key, path] = pair.split('=')
                const importHtml = renderMdFile(render, `${SRC_DIR}/${path}`, `  ${logIndent}`)
                return html.replace(`{{${key}}}`, importHtml)
            }, body)
        }

        return body
    }
    
    const renderMdFileToMd = (mdPath) => renderMdFile(renderToMd, mdPath)
    renderMdFileToMd.fileType = 'md'

    const renderMdFileToHtml = (mdPath) => renderMdFileToHtml.template
        .replace('{{contents}}', renderMdFile(renderToHtml, mdPath))
        .replace('{{htmlRenderDate}}', new Date())
    renderMdFileToHtml.fileType = 'html'
    renderMdFileToHtml.template = fs.readFileSync(BASE_TEMPLATE_PATH).toString()

    const buildMdFilesInDir = (srcDir, buildDir, buildFn) => {
        const allFileNames = fs.readdirSync(srcDir)
        if (!allFileNames || allFileNames.length < 1) {
            return failBuild(`error reading files from ${srcDir}`)
        }

        allFileNames.filter(fn => !fn.startsWith('_')).forEach(fileName => {
            const fileId = fileName.replace('.md', '')
            const fileSrc = `${srcDir}/${fileName}`
            const fileDest = `${buildDir}/${fileId}.${buildFn.fileType}`

            const fileContents = buildFn(fileSrc)
            writeFile(fileDest, fileContents)
        })
    }

    logMsg('WEBSITE')
    buildMdFilesInDir(WEBSITE_CONTENT_DIR, BUILD_DIR, renderMdFileToHtml)

    logMsg('\nRESUMES')
    buildMdFilesInDir(RESUMES_SRC_DIR, RESUME_BUILD_PATH, renderMdFileToHtml)
    buildMdFilesInDir(RESUMES_SRC_DIR, RESUME_BUILD_PATH, renderMdFileToMd)
}

module.exports = {
    buildHtml,
    BUILD_DIR,
    WATCHABLE_DIRS,
}