import { PreQuest } from '../../core'
import { Request, Response } from './types'
import { stringify } from 'qs'

export const defaultOption: Request = { method: 'get', headers: { Accept: 'application/json' }, responseType: 'text' }

export function fetchAdapter(options: Request) {
  return PreQuest.createInstance<Request, Response, Error>(
    async function adapter(config) {
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
    },
    options
  )
}

function timeoutThrow(timeout: number) {
  return new Promise((_, reject) => setTimeout(reject, timeout))
}

export const elementType = (ele: any) => {
  const typeStr = Object.prototype.toString.call(ele)
  const reg = /^\[object\s([A-Za-z]+)\]$/
  reg.test(typeStr)
  return RegExp.$1.toLowerCase()
}

export function formatBody(config: Request) {
  const { headers, data, requestType } = config
  const bodyType = elementType(data)

  // 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
  if (bodyType === 'object' || bodyType === 'array') {
    if (requestType === 'json') {
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        ...headers,
      }
      config.data = JSON.stringify(data);
    } else {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        ...headers,
      };
      config.data = stringify(data, { arrayFormat: 'repeat', strictNullHandling: true });
    }
  }

  return config
}
