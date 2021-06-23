import { createRequestUrl } from '@prequest/helper'
import { CommonRequest, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: T): Promise<N & any> => {
    return new Promise((resolve, reject) => {
      const finalOption = (opt || {}) as Required<CommonRequest>
      const url = createRequestUrl(finalOption)
      const { getNativeRequestInstance, cancelToken, ...rest } = finalOption

      let resolvePromise: any
      getNativeRequestInstance?.(new Promise(resolve => (resolvePromise = resolve)))

      const instance = request({
        ...rest,
        url,
        success: resolve,
        fail: reject,
      })

      if (cancelToken) {
        cancelToken.promise.then(() => {
          instance.abort()
        })
      }

      resolvePromise?.(instance)
    })
  }
}
