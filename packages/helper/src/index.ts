import { stringify } from 'qs';
import { elementType, merge } from '@prequest/utils'
import { BaseOption, CommonObject } from '@prequest/types'

export const baseOption: BaseOption = {
  path: '/',
  method: 'get',
  headers: {
    Accept: 'application/json'
  },
  responseType: 'json'
}

export function createRequestUrl<T>(ctx: T & { baseURL?: string, path: string, params?: any }): string {
  const { baseURL, path, params } = ctx

  let url = ''
  if (baseURL) url += baseURL
  if (path) url += path
  if (params) url += `?${stringify(params)}`

  return url
}

// 参考: https://github.com/umijs/umi-request/blob/master/src/middleware/simplePost.js
export function formatRequestBodyAndHeaders<T>(ctx: T & { headers: CommonObject, data: any, requestType: 'json' | 'form' | ({} & string) }) {
  const bodyType = elementType(ctx.data)

  const headers: CommonObject = {}
  let data = ctx.data

  if (bodyType === 'object' || bodyType === 'array') {
    if (ctx.requestType === 'json') {
      headers['Content-Type'] = 'application/json;charset=UTF-8'
      data = JSON.stringify(ctx.data);
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      data = stringify(ctx.data, { arrayFormat: 'repeat', strictNullHandling: true });
    }
  }

  return { data, headers: merge(headers, ctx.headers) }
}

// TODO: 更多信息
export function createError(message: string) {
  const error = new Error(message)
  return error
}
