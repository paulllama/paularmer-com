const fs = require('fs')
const { buildHtml } = require('./build-html')
const { BUILD_DIR, SRC_DIR } = require('./build.config')

const copyFileToBuild = (fileName, isFolder) => {
    fs.cpSync(
        `${SRC_DIR}/${fileName}`, 
        `${BUILD_DIR}/${fileName}`, 
        { recursive: !!isFolder }
    )
}
const copyDirToBuild = (dirName) => copyFileToBuild(dirName, true)

try {
    buildHtml({
        verbose: true,
    })

    copyFileToBuild('CNAME')
    copyDirToBuild('js')
    copyDirToBuild('media')
} catch (e) {
    console.error('\nERROR BUILDING\n')
    console.error(e)
}