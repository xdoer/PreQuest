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

export function formatRequestBodyAndHeaders(opt: PQRequest) {
  const options: any = opt
  const headers: Common = {}
  let data = options.data

  const bodyType = is(data)

  let hasContentType: boolean = bodyType === 'formdata'
  for (let [key, value] of Object.entries(options.headers)) {
    const _value = value as string
    if (/^Content-Type$/i.test(key)) {
      if (hasContentType) break
      hasContentType = true
      if (data !== void 0 && bodyType !== 'string') {
        if (/^application\/x-www-form-urlencoded/i.test(_value)) {
          data = stringify(data)
        } else if (/^application\/json/i.test(_value)) {
          data = JSON.stringify(data)
        }
      }
    }
  }
  if (!hasContentType && data !== void 0 && bodyType !== 'string') {
    headers['Content-Type'] = 'application/json'
    data = JSON.stringify(data)
  } // 默认为 json 类型

  return { data, headers: merge<Common>(headers, options.headers) }
}
