import { MiddlewareCallback } from '@prequest/types'
import { createError, ErrorCode } from '@prequest/helper'

function timeoutThrow(timeout: number, config: any) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(createError(ErrorCode.timeout, 'timeout', config))
    }, timeout)
  )
}

export default <MiddlewareCallback>async function(ctx, next) {
  const { timeout = -1 } = ctx.request

  if (timeout <= 0) return next()

  await Promise.race([timeoutThrow(timeout, ctx.request), next()])
}

declare module '@prequest/types' {
  export interface PQRequest {
    timeout?: number
  }
}
