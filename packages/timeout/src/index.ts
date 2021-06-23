import { MiddlewareCallback } from '@prequest/types'
import { createError, ErrorCode } from '@prequest/helper'

export interface TimeoutInject {
  timeout?: number
}

export default class TimeoutMiddleware<T, N> {
  constructor(private opt?: TimeoutInject) {}

  run: MiddlewareCallback<T & TimeoutInject, N> = async (ctx, next) => {
    const timeout = ctx.request.timeout ?? (this.opt?.timeout || 0)
    if (timeout <= 0) return next()

    await Promise.race([timeoutThrow(timeout, ctx.request), next()])
  }
}

function timeoutThrow(timeout: number, config: any) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(createError(ErrorCode.timeout, 'timeout', config))
    }, timeout)
  )
}
