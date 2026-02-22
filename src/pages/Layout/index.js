// 测试token是否成功注入
import { request } from '@/utils'
import { useEffect } from 'react'
const Layout = () => {
  useEffect(() => {
    request.get('/user/profile').then(res => {
      console.log(res)
    })
  }, [])
  return (
    <div>
      this is layout
    </div>
  )
}

export default Layout