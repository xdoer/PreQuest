import { createRequestUrl } from '@prequest/helper'
import { timeoutThrow, parseResBody } from './helper'
import { Request } from './types'

export async function adapter(options: Request) {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers, timeout, ...rest } = finalOptions

  const config = {
    ...rest,
    body: data,
    headers,
  } as any

  const res = (await (timeout
    ? Promise.race([timeoutThrow(timeout), fetch(url, config)])
    : fetch(url, config))) as any
  const resData = await parseResBody(res, options)
  const { status, statusText } = res

  return { headers: res.headers, data: resData, status, statusText }
}
