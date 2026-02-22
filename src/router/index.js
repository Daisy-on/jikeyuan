import Layout from '../pages/Layout'
import Login from '../pages/Login'
import AuthRoute from '../components/AuthRoute'
import { createBrowserRouter } from 'react-router-dom'

// 配置路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: (<AuthRoute> <Layout /> </AuthRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
