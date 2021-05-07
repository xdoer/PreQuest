import { PreQuest, PreQuestInstance } from '@prequest/core'
import { Request, Response } from './types'
import { baseOption, createRequestUrl, formatRequestBodyAndHeaders } from '@prequest/helper'
import { merge } from '@prequest/utils'
import { timeoutThrow, parseResBody } from './helper'

export * from './types'
export * from '@prequest/core'

class PreQuestFetch extends PreQuest<Request, Response> {
  constructor() {
    super(adapter)
  }

  create = (options?: Request) => {
    return PreQuest.createInstance<Request, Response>(adapter, merge(baseOption, options))
  }
}

export default new PreQuestFetch() as PreQuestFetch & PreQuestInstance<Request, Response>

async function adapter(options: Request) {
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
