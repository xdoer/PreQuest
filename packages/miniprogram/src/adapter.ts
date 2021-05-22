import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: Request & T): Promise<Response & N> => {
    const finalOption = (opt || {}) as Required<Request>
    const url = createRequestUrl(finalOption)
    const { getNativeRequestInstance, ...rest } = finalOption

    let resolvePromise: any
    getNativeRequestInstance?.(new Promise(resolve => (resolvePromise = resolve)))

    return new Promise((resolve, reject) => {
      const instance = request({
        url,
        ...rest,
        success: resolve,
        fail: reject,
      })

      resolvePromise?.(instance)
    })
  }
}
