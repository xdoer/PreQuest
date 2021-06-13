import { MiddlewareCallback } from '@prequest/types'
import { Options } from './types'

export type ErrorRetryOptions<T> = Options<T>

export class ErrorRetryMiddleware<T, N> {
  constructor(private opt?: Partial<Options<T>>) {}

  getOptions(ctx: any, opt: any) {
    return {
      retryCount: opt.retryCount ?? (ctx.request.retryCount || this.opt?.retryCount || 1),
      retryControl: ctx.request.retryControl || this.opt?.retryControl || defaultRetryControl,
    }
  }

  run: MiddlewareCallback<T & Partial<Options<T>>, N> = async (ctx, next, opt) => {
    try {
      await next()
    } catch (e) {
      const { retryCount, retryControl } = this.getOptions(ctx, opt)

      if (retryCount < 1 || !retryControl(ctx.request, e)) throw new Error(e)

      opt!.retryCount = retryCount - 1

      await ctx.context.controller.bind(ctx.context)(ctx, opt)
    }
  }
}

function defaultRetryControl(request: any) {
  const { method } = request
  return /^get$/i.test(method) || !method
}
