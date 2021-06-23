import { PreQuest, create } from '@prequest/miniprogram'
import { cacheMiddleware } from './cache'
import { errorRetryMiddleware } from './error-retry'
import { lock, wrapper } from './token'

PreQuest.defaults.baseURL = 'http://localhost:8080'

interface Req {
  skipTokenCheck: boolean
}

interface Res { }

export const prequest = create<Req, Res>(uni.request)

prequest
  .use(cacheMiddleware.run)
  .use(errorRetryMiddleware.run)
  .use(async (ctx, next) => {
    // 获取 token 接口跳过添加 token 步骤
    if (ctx.request.skipTokenCheck) return next()

    const token = await wrapper(getToken)
    console.log('中间件 token', token)
    await next()
  })
  .use(async (ctx, next) => {
    await next()
    const { data, statusCode } = ctx.response
    if (statusCode !== 200) {
      // 用户服务器返回 401, 微信不会抛出异常、需要用户自己处理
      // 这里抛出异常，会被错误重试中间件捕获
      if (statusCode === 401) {
        lock.clear()
      }
      throw new Error(data as string || '响应数据有误')
    }
    ctx.response = data as any
  })

function getToken() {
  // 类型可以在创建 prequest 实例的时候，进行添加
  // 这里添加自定义参数，传到中间件，中间件做相应处理
  return prequest('/token', { skipTokenCheck: true })
}
