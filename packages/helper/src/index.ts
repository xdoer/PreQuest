import { elementType, convertObjToSearchParams } from '@prequest/utils'
import { BaseOption } from '@prequest/types'

export const baseOption: BaseOption = {
  path: '/',
  method: 'get',
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

  if (params && !isEmpty(params)) url += `?${convertObjToSearchParams(params)}`

  return url
}

export function isEmpty(value: any) {
  const type = elementType(value)
  switch (type) {
    case 'object':
      return !Object.keys(type).length
    case 'array':
      return !type.length
    default:
      return !type
  }
}

// TODO: 更多信息
export function createError(message: string) {
  const error = new Error(message)
  return error
}

// reference: https://github.com/axios/axios/blob/master/lib/helpers/isAbsoluteURL.js
export function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
