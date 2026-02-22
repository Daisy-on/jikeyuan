// 和用户相关的状态管理模块
import { createSlice } from '@reduxjs/toolkit'
import { request, getToken, setToken as _setToken } from '@/utils'

const userStore = createSlice({
  name: 'user',
  initialState: {
    token: getToken() || ''
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      // LocalStorage 持久化存储
      _setToken(action.payload)
    }
  }
})

const { setToken } = userStore.actions
const userReducer = userStore.reducer

// 异步方法 登录获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await request.post('/authorizations', loginForm)
    // 提交同步action进行token存入
    dispatch(setToken(res.data.token))
  }
}

export { setToken, fetchLogin }
export default userReducer