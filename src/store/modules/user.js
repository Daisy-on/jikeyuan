// 和用户相关的状态管理模块
import { createSlice } from '@reduxjs/toolkit'
import { getToken, removeToken, setToken as _setToken } from '@/utils'
import { loginAPI, fetchUserInfoAPI } from '@/apis/user'

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      // LocalStorage 持久化存储
      _setToken(action.payload)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state) {
      state.token = ''
      state.userInfo = {}
      // 清空token
      removeToken()
    }
  }
})

const { setToken, setUserInfo, clearUserInfo } = userStore.actions
const userReducer = userStore.reducer

// 异步方法 登录获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm)
    // 提交同步action进行token存入
    dispatch(setToken(res.data.token))
  }
}

// 异步方法 获取用户信息
const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await fetchUserInfoAPI()
    // 提交同步action进行用户信息存入
    dispatch(setUserInfo(res.data))
  }
}

export { setToken, fetchLogin, fetchUserInfo, clearUserInfo }
export default userReducer