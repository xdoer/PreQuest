import ErrorRetryMiddleware from '@prequest/error-retry'
import { Request, Response } from '@prequest/miniprogram'

export const errorRetryMiddleware = new ErrorRetryMiddleware<Request, Response>({
  // 错误重试次数
  retryCount: 2,

  // opt 为 Request 类型，通过该函数，你可以控制那些接口需要错误重试
  retryControl(opt, e) {
    const { method, path } = opt

    // api 路径不进行错误重试
    if (path === '/api') return false

    // 只有 get 方法才进行错误重试
    return method === 'get' || !method
  },
})
