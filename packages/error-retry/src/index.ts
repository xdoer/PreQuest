import { MiddlewareCallback } from '@prequest/types'
import { Options } from './types'

export type ErrorRetryOptions<T> = Options<T>

export default class ErrorRetryMiddleware<T, N> {
  constructor(private opt?: Partial<Options<T>>) {}

  private getOptions(ctx: any, opt: any) {
    const initRetryCount = ctx.request.retryCount || this.opt?.retryCount || 0
    const retryControl = ctx.request.retryControl || this.opt?.retryControl || defaultRetryControl
    return {
      retryCount: opt.retryCount ?? initRetryCount,
      retryControl,
    }
  }

  run: MiddlewareCallback<T & Partial<Options<T>>, N> = async (ctx, next, opt) => {
    try {
      await next()
    } catch (e) {
      const { retryCount, retryControl } = this.getOptions(ctx, opt)

      if (retryCount < 1 || !retryControl(ctx.request, e)) throw e

      opt!.retryCount = retryCount - 1

      await ctx.context.controller.bind(ctx.context)(ctx, opt)
    }
  }
}

function defaultRetryControl(request: any) {
  const { method } = request
  return /^get$/i.test(method) || !method
}
