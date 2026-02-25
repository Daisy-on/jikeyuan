// 用户相关请求
import { request } from '@/utils/request'

// 1. 登录请求
function loginAPI(formData) {
  return request({
    method: 'POST',
    url: '/authorizations',
    data: formData
  })
}

// 2. 获取用户信息
function fetchUserInfoAPI() {
  return request({
    method: 'GET',
    url: '/user/profile'
  })
}

export { loginAPI, fetchUserInfoAPI }
