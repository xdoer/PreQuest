import { stringify } from 'qs'
import { is, merge, isAbsoluteURL, isEmpty } from '@xdoer/x'
import { PresetOption, Common, PQRequest } from '@prequest/types'

export * from './error'

export const baseOption: PresetOption = {
  path: '/',
  method: 'GET',
}

export function createRequestUrl<
  T extends { baseURL?: string; path: string; url?: string; params?: Common }
>(req: T): string {
  const { baseURL, path, params } = req

  let url = req.url || ''

  if (isAbsoluteURL(path)) {
    url += path
  } else {
    if (baseURL) url += baseURL
    if (path) url += path
  }

  if (params && !isEmpty(params)) url += `?${stringify(params)}`

  return url
}

export function requestId(options: PQRequest): string {
  return createRequestUrl({ ...options, params: {} })
}

// 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
export function formatRequestBodyAndHeaders(opt: PQRequest) {
  const options: any = opt
  const bodyType = is(options.data)

  const headers: Common = {}
  let data = options.data

  if (bodyType === 'object' || bodyType === 'array') {
    if (options.requestType === 'json') {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
      data = JSON.stringify(options.data)
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      data = stringify(options.data, {
        arrayFormat: 'repeat',
        strictNullHandling: true,
      })
    }
  }

  return { data, headers: merge<Common>(headers, options.headers) }
}
