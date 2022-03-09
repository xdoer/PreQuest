import { createError, createRequestUrl, ErrorCode } from '@prequest/helper'
import { PQRequest } from '@prequest/types'
import { RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: T): Promise<N> => {
    return new Promise((resolve, reject) => {
      const finalOption = (opt || {}) as PQRequest
      const url = createRequestUrl(finalOption)
      const { getNativeRequestInstance, cancelToken, ...rest } = finalOption

      const instance = request({
        ...rest,
        url,
        success: resolve,
        fail: reject,
      })

      if (cancelToken) {
        cancelToken.promise.then(cancel => {
          if (!instance) return

          // 如果支持取消方法
          if (instance.abort) return instance.abort()

          // 如果不支持，则直接抛出错误
          reject(createError(ErrorCode.abort, cancel, opt as any))
        })
      }

      getNativeRequestInstance?.(instance)
    })
  }
}
