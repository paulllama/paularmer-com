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
    path: url => `./src/styles${url}`,
  },
  {
    regex: /(\/|.*\.html)$/, 
    type: 'text/html',
    path: url => `./build${url === '/' ? '/index.html' : url}`,
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

  for (const { regex, type, path} of assetTypes) {
    if (!filePath && regex.test(req.url)) {
      filePath = path ? path(req.url) : `./src${req.url}`
      contentType = type
    }
  }

  console.log(`serving ${filePath} for ${req.url}`)
  res.writeHead(200, { 'content-type': contentType })
  try {
    const readable = fs.createReadStream(filePath)
    readable.pipe(res)
  } catch (e) {
    console.error(e)
    res.writeHead(404, { 'content-type': 'text/html' })
    fs.createReadStream('./src/404.html').pipe(res)
  }
})

const port = process.env.PORT || 6969
server.listen(port)
console.log(`👂 Now serving at port ${port}`)