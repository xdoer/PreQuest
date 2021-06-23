import { Request } from './types'
import { createRequestUrl, formatRequestBodyAndHeaders } from '@prequest/helper'
import { timeoutThrow, parseResBody } from './helper'

export async function adapter(options: Request) {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const { timeout, cancelToken, ...rest } = finalOptions

  const config = { ...rest, body: data, headers } as any

  if (cancelToken) {
    cancelToken.promise.then(cancel => {
      cancelToken.abortController?.abort()
      if (!cancelToken.abortController) {
        throw new Error(cancel || 'cancel')
      }
    })
    config.signal = cancelToken.abortController?.signal
  }

  const res = (await (timeout
    ? Promise.race([timeoutThrow(timeout, config), fetch(url, config)])
    : fetch(url, config))) as globalThis.Response
  const resData = await parseResBody(res, options)
  const { status, statusText } = res

  return { headers: res.headers, data: resData, status, statusText }
}
