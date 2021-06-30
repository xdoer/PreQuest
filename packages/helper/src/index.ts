import { stringify } from 'qs'
import { elementType, merge } from '@prequest/utils'
import { BaseOption, CommonObject } from '@prequest/types'

export * from './error'

export const baseOption: BaseOption = {
  path: '/',
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
  responseType: 'json',
}

export function createRequestUrl<T>(
  ctx: T & { baseURL?: string; path: string; params?: any; url?: string }
): string {
  const { baseURL, path, params } = ctx

  let url = ctx.url || ''

  if (isAbsoluteURL(path)) {
    url += path
  } else {
    if (baseURL) url += baseURL
    if (path) url += path
  }

  if (params && !isEmpty(params)) url += `?${stringify(params)}`

  return url
}

export function isEmpty(value: any) {
  const type = elementType(value)
  switch (type) {
    case 'object':
      return !Object.keys(value).length
    case 'array':
      return !value.length
    default:
      return !value
  }
}

// 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
export function formatRequestBodyAndHeaders<T>(
  ctx: T & {
    headers: CommonObject
    data: any
    requestType: 'json' | 'form' | ({} & string)
  }
) {
  const bodyType = elementType(ctx.data)

  const headers: CommonObject = {}
  let data = ctx.data

  if (bodyType === 'object' || bodyType === 'array') {
    if (ctx.requestType === 'json') {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
      data = JSON.stringify(ctx.data)
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      data = stringify(ctx.data, {
        arrayFormat: 'repeat',
        strictNullHandling: true,
      })
    }
  }

  return { data, headers: merge(headers, ctx.headers) }
}

// reference: https://github.com/axios/axios/blob/master/lib/helpers/isAbsoluteURL.js
export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
