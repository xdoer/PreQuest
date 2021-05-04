import { PreQuest } from '@prequest/core'
import { Request, Response } from './types'
import { baseOption, createRequestUrl, formatRequestBodyAndHeaders, merge } from '@prequest/helper'

export * from './types'
export * from '@prequest/core'

const create = (options: Request) => {
  return PreQuest.createInstance<Request, Response>(adapter, merge(baseOption, options))
}

export { create }

export default create

function timeoutThrow(timeout: number) {
  return new Promise((_, reject) => setTimeout(reject, timeout))
}

async function adapter(options: Request) {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const { timeout, method } = finalOptions

  const config = {
    body: data,
    headers,
    method,
  }

  const res = await (timeout ? Promise.race([timeoutThrow(timeout), fetch(url, config)]) : fetch(url, config)) as globalThis.Response

  const { status, statusText } = res
  const resData = await res.json()

  return { headers: res.headers, data: resData, status, statusText }
}
