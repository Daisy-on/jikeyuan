// 封装高阶组件
import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

function AuthRoute({ children }) {
  const token = getToken()
  if (!token) {
    // 未登录 跳转登录页
    return <Navigate to="/login" replace />
  }
  // 已登录 渲染子组件
  return <>{children}</>
}

export default AuthRoute
