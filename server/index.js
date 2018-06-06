require('./ignore.js')()
require('babel-polyfill')
require('babel-register')({
  presets: ['env', 'react', 'stage-0'],
  plugins: ['react-loadable/babel', 'syntax-dynamic-import', 'dynamic-import-node']
})


const app = require('./app.js').default
const clientRouter = require('./clientRouter.js').default
const staticCache = require('koa-static-cache')
const path = require('path')
const cors = require('koa2-cors')
const Loadable = require('react-loadable')

const port = process.env.port || 3002
app.use(cors())
app.use(clientRouter)
app.use(staticCache(path.resolve(__dirname, '../dist'), {
  maxAge: 365 * 24 * 60 * 60,
  gzip: true
}))


console.log(`\n==>Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)
Loadable.preloadAll().then(() => {
  app.listen(port)
})

