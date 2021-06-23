import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: Request & T): Promise<Response & N> => {
    return new Promise((resolve, reject) => {
      const finalOption = (opt || {}) as Required<Request>
      const url = createRequestUrl(finalOption)
      const { getNativeRequestInstance, cancelToken, ...rest } = finalOption

      let resolvePromise: any
      let promise = new Promise(resolve => (resolvePromise = resolve))
      getNativeRequestInstance?.(promise)

      const instance = request({
        url,
        ...rest,
        success: resolve,
        fail: reject,
      })

      if (cancelToken) {
        cancelToken.promise.then(() => {
          /**
           * 1、instance 在执行时一定存在
           * 2、abort 后，会走 fail 回调
           * 3、因为 fail 回调捕获的错误不同平台可能不一致，所以不对错误做处理，需要用户自己根据平台文档判断是否是取消请求。例如: 微信取消请求报错 '{ errMsg: 'request:fail abort' }'，需要根据 errMsg 判断。
           */
          instance.abort()
        })
      }

      resolvePromise?.(instance)
    })
  }
}
