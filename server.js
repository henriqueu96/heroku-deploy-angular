const express = require('express')
const path = require('path')

const app = express()
const appName = 'lista-compras'
app.use(express.static(`${__dirname}/dist/${appName}`))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/${appName}/index.html`))
});

console.log('App running')
app.listen(process.env.PORT || 8080);
