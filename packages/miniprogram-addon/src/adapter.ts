import { createRequestUrl } from '@prequest/helper'
import { CommonRequest, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: CommonRequest & T): Promise<N & any> => {
    const finalOption = (opt || {}) as Required<CommonRequest>
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
        ...rest,
        url,
        success: resolve,
        fail: reject,
      })

      resolvePromise?.(instance)
    })
  }
}