import { AdapterRequest, Response } from '../types'

interface Opt {
  parseBody(ctx: globalThis.Response): Promise<any>
}

export function fetchAdapter(opt: Opt) {
  const { parseBody } = opt
  return async function (url: string, config: Required<AdapterRequest>): Promise<Response> {
    const { method, headers, timeout, data, injectAdapterInstance } = config

    const options = {
      body: data,
      headers,
      method,
    }

    const instance = injectAdapterInstance?.(url, config) || fetch(url, options)

    const res = await (timeout ? Promise.race([timeoutThrow(timeout), instance]) : instance)

    const { status, statusText } = res
    const resData = await parseBody(res)

    return { headers: res.headers, data: resData, status, statusText }
  }
}

function timeoutThrow(timeout: number) {
  return new Promise((_, reject) => setTimeout(reject, timeout))
}
