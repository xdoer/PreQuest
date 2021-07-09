import { MiddlewareCallback } from '@prequest/types'
import { createError, ErrorCode } from '@prequest/helper'

export interface TimeoutInject<T> {
  timeout: number
  timeoutControl(opt: T): boolean
}

function timeoutThrow(timeout: number, config: any) {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(createError(ErrorCode.timeout, 'timeout', config))
    }, timeout)
  )
}

function createDefaultOption<T>(): TimeoutInject<T> {
  return {
    timeout: 5000,
    timeoutControl: () => true,
  }
}

export default function timeoutMiddleware<T, N>(
  opt?: Partial<TimeoutInject<T>>
): MiddlewareCallback<T & TimeoutInject<T>, N> {
  const options = Object.assign({}, createDefaultOption<T>(), opt)

  return async function(ctx, next) {
    const { timeout, timeoutControl } = Object.assign({}, options, ctx.request)

    if (!timeoutControl(ctx.request)) return next()

    if (timeout <= 0) return next()

    await Promise.race([timeoutThrow(timeout, ctx.request), next()])
  }
}
