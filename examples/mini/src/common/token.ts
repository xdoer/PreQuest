import { Lock, createLockWrapper } from '@prequest/lock'
import { getStorageSync, removeStorageSync, setStorageSync } from '@tarojs/taro'
import { create } from '@prequest/miniprogram'
import { parseResponse } from './mddleware'

// token 请求不走 token 校验中间件、所以需要新建一个请求实例
const tokenRequest = create(wx.request)
tokenRequest.use(parseResponse)

export const lock = new Lock({
  async getValue() {
    return getStorageSync('token')
  },
  async setValue(token) {
    setStorageSync('token', token)
  },
  async clearValue() {
    removeStorageSync('token')
  }
})
const wrapper = createLockWrapper(lock)

function getToken() {
  return tokenRequest('/token')
}

export async function lockMiddleware(ctx, next) {
  const token = await wrapper(getToken)
  console.log('中间件 token', token)
  await next()
}
