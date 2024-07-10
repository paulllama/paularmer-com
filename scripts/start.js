const http = require('http')
const fs = require('fs')

const assetTypes = [
  {
    regex: /.*\.css(\.map)?$/, 
    type: 'text/css',
  },
  {
    regex: /.*\.woff|woff2|ttf$/, 
    type: 'font',
  },
  {
    regex: /(\/|.*\.html)$/, 
    type: 'text/html',
    path: url => `${url === '/' ? '/index.html' : url}`,
  },
  {
    regex: /.*\.png|jpg|svg|ico$/, 
    type: 'image',
  },
  {
    regex: /.*\.js$/, 
    type: 'text/javascript',
  },
  {
    regex: /.*\.pdf$/, 
    type: 'x-pdf',
  },
]

const server = http.createServer((req, res) => {
  let filePath
  let contentType

  try {
    for (const { regex, type, path} of assetTypes) {
      if (!filePath && regex.test(req.url)) {
        filePath = `./build${path ? path(req.url) : req.url}`
        contentType = type
      }
    }
  
    console.log(`serving ${filePath} for ${req.url}`)
    res.writeHead(200, { 'content-type': contentType })
    fs.createReadStream(filePath).pipe(res)
  } catch (e) {
    console.error(e)
    try {
      res.writeHead(404, { 'content-type': 'text/html' })
      fs.createReadStream('./build/404.html').pipe(res)
    } catch (e2) {
      console.error(e2)
    }
  }
})

const port = process.env.PORT || 6969
server.listen(port)
console.log(`👂 Now serving at port ${port}`)