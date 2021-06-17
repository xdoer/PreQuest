import { Request } from './types'
import { createRequestUrl, formatRequestBodyAndHeaders } from '@prequest/helper'
import { timeoutThrow, parseResBody } from './helper'

export async function adapter(options: Request) {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const { timeout, ...rest } = finalOptions

  const config = {
    ...rest,
    body: data,
    headers,
  } as any

  const res = (await (timeout
    ? Promise.race([timeoutThrow(timeout), fetch(url, config)])
    : fetch(url, config))) as globalThis.Response
  const resData = await parseResBody(res, options)
  const { status, statusText } = res

  return { headers: res.headers, data: resData, status, statusText }
}
