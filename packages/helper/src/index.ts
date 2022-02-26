import { stringify } from 'qs'
import { elementType, merge } from '@prequest/utils'
import { BaseOption, CommonObject, PreQuestRequest } from '@prequest/types'

export * from './error'

export const baseOption: BaseOption = {
  path: '/',
  method: 'GET',
}

export function createRequestUrl<
  T extends { baseURL?: string; path: string; url?: string; params?: CommonObject }
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

export function requestId(options: PreQuestRequest): string {
  return createRequestUrl({ ...options, params: {} })
}

export function isEmpty(value: any) {
  const type = elementType(value)
  switch (type) {
    case 'object':
      return !Reflect.ownKeys(value).length && value.constructor === Object
    case 'array':
      return !value.length
    default:
      return !value
  }
}

// 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
export function formatRequestBodyAndHeaders(opt: PreQuestRequest) {
  const options: any = opt
  const bodyType = elementType(options.data)

  const headers: CommonObject = {}
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

  return { data, headers: merge<CommonObject>(headers, options.headers) }
}

// reference: https://github.com/axios/axios/blob/master/lib/helpers/isAbsoluteURL.js
export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
