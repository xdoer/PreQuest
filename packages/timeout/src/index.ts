import { MiddlewareCallback } from '@prequest/types'
import { createError, ErrorCode } from '@prequest/helper'
import { TimeoutOptions } from './types'

function timeoutThrow(timeout: number, config: any) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(createError(ErrorCode.timeout, 'timeout', config))
    }, timeout)
  )
}

const defaultOptions = {
  timeout: 5000,
  timeoutControl: () => true,
}

export default function timeoutMiddleware(opt?: TimeoutOptions): MiddlewareCallback {
  const options = Object.assign({}, defaultOptions, opt)

  return async function(ctx, next) {
    const { timeout } = Object.assign({}, options, ctx.request)

    if (!options.timeoutControl(ctx.request)) return next()

    if (timeout <= 0) return next()

    await Promise.race([timeoutThrow(timeout, ctx.request), next()])
  }
}
