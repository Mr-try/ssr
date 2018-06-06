import Home from '../../pages/home/connect'
import User from '../../pages/user/connect'

const routesConfig = [
  {
    path: '/',
    exact: true,
    component: Home,
  }, 
  {
    path: '/home',
    component: Home,
  }, 
  {
    path: '/user',
    component: User,
  }, 
]
export default routesConfig

