import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export function adapter<T, N>(request: RequestCore) {
  return (opt: Request & T): Promise<Response & N> => {
    const finalOption = (opt || {}) as Required<Request>
    const url = createRequestUrl(finalOption)
    const { getRequestInstance = () => {}, ...rest } = finalOption

    return new Promise((resolve, reject) => {
      getRequestInstance(
        request({
          url,
          ...rest,
          success: resolve,
          fail: reject,
        })
      )
    })
  }
}
