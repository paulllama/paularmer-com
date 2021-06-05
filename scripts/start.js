const http = require('http')
const fs = require('fs')

const regex = {
  css: /.*\.css$/,
  img: /.*\.png|jpg|svg$/
}

const server = http.createServer((req, res) => {
  let filePath = './src/index.html'
  let contentType = 'text/html'

  if (regex.img.test(req.url)) {
    filePath = `./src/${req.url}`
    contentType = 'image'
  } else if (regex.css.test(req.url)) {
    filePath = './src/styles.css'
    contentType = 'text/css'
  }

  console.log(`serving ${filePath} for ${req.url}`)
  res.writeHead(200, { 'content-type': contentType })
  fs.createReadStream(filePath).pipe(res)
})

const port = process.env.PORT || 6969
server.listen(port)
console.log(`👂 Now serving at port ${port}`)