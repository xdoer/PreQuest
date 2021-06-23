import { Request } from './types'
import {
  createError,
  createRequestUrl,
  ErrorCode,
  formatRequestBodyAndHeaders,
} from '@prequest/helper'
import { parseResBody } from './helper'

export function adapter<T, N>() {
  return async (options: T): Promise<N> => {
    const finalOptions = (options || {}) as Required<Request>
    const url = createRequestUrl(finalOptions)
    const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
    const { timeout, cancelToken, ...rest } = finalOptions

    const config = { ...rest, body: data, headers } as any

    if (cancelToken) {
      cancelToken.promise.then(cancel => {
        cancelToken.abortController?.abort()

        // 环境不支持 abortController，则直接抛异常
        if (!cancelToken.abortController) {
          throw createError(ErrorCode.abort, cancel, config)
        }
      })
      config.signal = cancelToken.abortController?.signal
    }

    const res = await fetch(url, config)
    const resData = await parseResBody(res, options)
    const { status, statusText } = res

    return { headers: res.headers, data: resData, status, statusText } as any
  }
}
