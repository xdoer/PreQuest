import { createError, ErrorCode } from '@prequest/helper'
import { Request } from './types'

export function timeoutThrow(timeout: number, config: any) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(createError(ErrorCode.timeout, 'timeout', config))
    }, timeout)
  )
}

export function parseResBody(res: globalThis.Response, options: Request) {
  const { responseType = 'json' } = options

  switch (responseType) {
    case 'json':
      return res.json()
    case 'blob':
      return res.blob()
    case 'arraybuffer':
      return res.arrayBuffer()
    default:
      return res.text()
  }
}
