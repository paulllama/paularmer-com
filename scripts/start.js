const http = require('http')
const fs = require('fs')

const regex = {
  css: /.*\.css$/,
  img: /.*\.png|jpg|svg$/,
  font: /.*\.woff|woff2|ttf$/,
}

const server = http.createServer((req, res) => {
  let filePath = './src/index.html'
  let contentType = 'text/html'

  const testUrl = pattern => pattern.test(req.url)

  if (testUrl(regex.img)) {
    filePath = `./src/${req.url}`
    contentType = 'image'
  } else if (testUrl(regex.css)) {
    filePath = './src/styles.css'
    contentType = 'text/css'
  } else if (testUrl(regex.font)) {
    filePath = `./src/styles/${req.url}`
    contentType = 'font'
  }


  console.log(`serving ${filePath} for ${req.url}`)
  res.writeHead(200, { 'content-type': contentType })
  fs.createReadStream(filePath).pipe(res)
})

const port = process.env.PORT || 6969
server.listen(port)
console.log(`👂 Now serving at port ${port}`)