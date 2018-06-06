import React from 'react'
import { Router, Route } from 'dva/router'
import routesConfig from './routes'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <div>
        {routesConfig.map(route => (
          <Route key={route.path}
            exact={route.exact}
            path={route.path}
            render={() => (<route.component />)}
            thunk={route.thunk}
          />))}
      </div>      
    </Router>
  )
}

export default RouterConfig