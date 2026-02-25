// axios 封装处理
// 1. 根域名，2. 超时时间，3. 请求拦截器 响应拦截器
import axios from 'axios'
import { getToken, removeToken } from './token'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // 注入token 1.获取token 2. 按后端的要求拼接token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
}
)

// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  // 监控 401 token失效
  console.dir(error)
  if (error.response.status === 401) {
    // 1. 清空本地存储
    removeToken()
    // 2. 跳转登录页
    router.navigate('/login')
    // 3. 中断 Promise 链，防止红屏
    return new Promise(() => {})
  }
  return Promise.reject(error)
})

export { request }