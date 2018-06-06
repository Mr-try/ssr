import dva from 'dva'
import {registerModels} from './resource/models'
import routesConfig from './resource/routes'
import routes from './resource/router'
// 引入dva
const app = dva()

// models注入
registerModels(app)

// 路由定义
app.router(require('./resource/router'))

// 渲染
window.main = () => app.start('#root')
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('.', () => {
    app.start('#root')
  })
}
export default {
  routes,
  routesConfig,
  registerModels
} 