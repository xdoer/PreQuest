import { stringify } from 'qs'
import { isAbsoluteURL, isEmpty } from '@xdoer/x'
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
