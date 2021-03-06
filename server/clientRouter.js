import fs from 'fs'
import dva from 'dva'
import path from 'path'
import Helmet from 'react-helmet'
import {matchPath} from 'react-router-dom'
import {renderToString} from 'react-dom/server'
import { getBundles } from 'react-loadable/webpack'
import createHistory from 'history/createMemoryHistory'
import { matchRoutes } from 'react-router-config'
import stats from '../dist/react-loadable.json'
import client from '../client/index.js'

const {routes, createApp, configureStore, routesConfig, registerModels} = client
const app = dva()
registerModels(app)
app.router(require(routes))

const createStore = (configureStore) => {
  let store = configureStore()
  return store
}

const createTags = (modules) => {
  let bundles = getBundles(stats, modules)
  let scriptfiles = bundles.filter(bundle => bundle.file.endsWith('.js'))
  let stylefiles = bundles.filter(bundle => bundle.file.endsWith('.css'))
  let scripts = scriptfiles.map(script => `<script src="/${script.file}"></script>`).join('\n')
  let styles = stylefiles.map(style => `<link href="/${style.file}" rel="stylesheet"/>`).join('\n')
  return {scripts, styles}
}

const prepHTML = (data, {html, head, rootString, scripts, styles, initState}) => {
  data = data.replace('<html', `<html ${html}`)
  data = data.replace('</head>', `${head} \n ${styles}</head>`)
  data = data.replace('<div id="root"></div>', `<div id="root">${rootString}</div>`)
  data = data.replace('<body>', `<body> \n <script>window.__INITIAL_STATE__ =${JSON.stringify(initState)}</script>`)
  data = data.replace('</body>', `${scripts}</body>`)
  return data
}

const makeup = (ctx, store, createApp, html) => {
  let initState = store.getState()
  let history = createHistory({initialEntries: [ctx.req.url]})

  let modules = []

  let rootString = renderToString(createApp({store, history, modules}))

  let {scripts, styles} = createTags(modules)

  const helmet = Helmet.renderStatic()
  let renderedHtml = prepHTML(html, {
    html: helmet.htmlAttributes.toString(),
    head: helmet.title.toString() + helmet.meta.toString() + helmet.link.toString(),
    rootString,
    scripts,
    styles,
    initState
  })
  return renderedHtml
}


const clientRouter = async (ctx, next) => {
  // 获取项目的index.html
  let html = fs.readFileSync(path.join(path.resolve(__dirname, '../dist'), 'index.html'), 'utf-8')
  
  let store = createStore(configureStore)
  let branch = matchRoutes(routesConfig, ctx.req.url)
  let promises = branch.map(({route}) => {
    return route.thunk ? (route.thunk(store)) : Promise.resolve(null)
  })
  await Promise.all(promises).catch(err => console.log('err:---', err))

  // 路由匹配 
  const getMatch = (routesArray, url) => {
    return routesArray.some(router => matchPath(url, {path: router.path, exact: router.exact, }))
  }
  // 如果匹配到对应的路由则renderHtml
  if (getMatch(routesConfig, ctx.req.url)) {
    let renderedHtml = await makeup(ctx, store, createApp, html)
    ctx.body = renderedHtml
  }
  await next()
}

export default clientRouter

