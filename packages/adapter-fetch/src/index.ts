import { PreQuest } from '@prequest/core'
import { Request, Response } from './types'

export default (options: Request) => {

  async function adapter(config: Request) {
    const { method, headers, timeout, data, baseURL, path } = config as Required<Request>
    const url = baseURL + path

    const options = {
      body: data,
      headers,
      method,
    }

    const res = await (timeout ? Promise.race([timeoutThrow(timeout), fetch(url, options)]) : fetch(url, options)) as globalThis.Response

    const { status, statusText } = res
    const resData = await res.json()

    return { headers: res.headers, data: resData, status, statusText }
  }

  return PreQuest.createInstance<Request, Response>(adapter, options)
}

function timeoutThrow(timeout: number) {
  return new Promise((_, reject) => setTimeout(reject, timeout))
}
