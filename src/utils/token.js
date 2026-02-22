// 封装token相关方法
const TOKEN_KEY = 'token_key'

// 获取token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || ''
}

// 设置token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}