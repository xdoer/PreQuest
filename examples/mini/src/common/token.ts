import Lock from '@prequest/lock'
import { getStorageSync, removeStorageSync, setStorageSync } from '@tarojs/taro'
import { prequest } from './request'

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
const wrapper = Lock.createLockWrapper(lock)

function getToken() {

  // 类型可以在创建 prequest 实例的时候，进行添加
  // 这里添加自定义参数，传到中间件，中间件做相应处理
  return prequest('/token', { skipTokenCheck: true })
}

export async function lockMiddleware(ctx, next) {
  // 获取 token 接口跳过添加 token 步骤
  if (ctx.request.skipTokenCheck) return next()

  const token = await wrapper(getToken)
  console.log('中间件 token', token)
  await next()
}
