import { stringify } from 'qs'
import { is, isAbsoluteURL, isEmpty } from '@xdoer/x'
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
  const orgHeaders = options.headers
  const headers: Common = {}
  let data = options.data

  const isFormData: boolean = is(data) === 'formdata'
  let hasContentType: boolean = isFormData // formdata is not need
  if (is(orgHeaders) === 'object') {
    for (let [key, value] of Object.entries(orgHeaders)) {
      const _value = value as string
      if (/^Content-Type$/i.test(key)) {
        hasContentType = true
        if (isFormData && /^multipart\/form-data/i.test(_value)) continue
        if (!isFormData && data !== void 0 && is(data) !== 'string') {
          if (/^application\/x-www-form-urlencoded/i.test(_value)) {
            data = stringify(data)
          } else if (/^application\/json/i.test(_value)) {
            data = JSON.stringify(data)
          }
        }
      }
      headers[key] = value
    }
  } else if (orgHeaders !== void 0 && orgHeaders !== null) {
    const hasConsole = typeof console !== 'undefined'
    hasConsole && console.error("request:error parameter `headers`. Expected Object, got " + is(orgHeaders))
  }
  if (!hasContentType && data !== void 0 && is(data) !== 'string') {
    headers['Content-Type'] = 'application/json'
    data = JSON.stringify(data)
  } // defaults to json

  return { data, headers }
}
