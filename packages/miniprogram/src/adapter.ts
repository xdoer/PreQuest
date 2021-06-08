import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: Request & T): Promise<Response & N> => {
    const finalOption = (opt || {}) as Required<Request>
    const url = createRequestUrl(finalOption)
    const { getNativeRequestInstance, cancelToken, ...rest } = finalOption

    let resolvePromise: any
    getNativeRequestInstance?.(new Promise(resolve => (resolvePromise = resolve)))

    return new Promise((resolve, reject) => {
      let instance: RequestCore
      if (cancelToken) {
        // 执行请求时被取消
        cancelToken.promise.then(() => {
          // 这里的 instance 在执行时是一定存在的
          instance.abort()
          reject(cancelToken.reason)
        })
      }

      instance = request({
        url,
        ...rest,
        success: resolve,
        fail: reject,
      })

      resolvePromise?.(instance)
    })
  }
}
