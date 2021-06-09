import { MiddlewareCallback, RequestOption } from '@prequest/types'
import { Options, RetryControl } from './types'

export class ErrorRetryMiddleware<T, N> {
  private retryCount: number
  private retryControl: RetryControl<T>

  constructor(private opt?: Partial<Options<T>>) {
    this.retryCount = this.opt?.retryCount || 1
    this.retryControl = this.opt?.retryControl || retryControl
  }

  run: MiddlewareCallback<T, N> = async (ctx, next, opt) => {
    try {
      await next()
    } catch (e) {
      const initRetryCount: number = opt!.retryCount ?? this.retryCount
      const canRetry = this.retryControl(ctx.request, e)
      const retryCountLimit = initRetryCount < 1

      if (!canRetry || retryCountLimit) throw new Error(e)

      opt!.retryCount = initRetryCount - 1

      await ctx.context.controller.bind(ctx.context)(ctx, opt)
    }
  }
}

function retryControl<T>(opt: RequestOption<T>) {
  const { method } = opt
  return method === 'get'
}
