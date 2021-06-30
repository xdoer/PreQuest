import { MiddlewareCallback } from '@prequest/types'
import { createError, ErrorCode } from '@prequest/helper'

export interface TimeoutInject<T> {
  timeout?: number
  timeoutControl?(opt: T): boolean
}

export default class TimeoutMiddleware<T, N> {
  constructor(private opt?: TimeoutInject<T>) {}

  run: MiddlewareCallback<T & TimeoutInject<T>, N> = async (ctx, next) => {
    const timeout = ctx.request.timeout ?? (this.opt?.timeout || 0)
    const timeoutControl = this.opt?.timeoutControl || (() => true)

    if (!timeoutControl(ctx.request)) return next()

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
