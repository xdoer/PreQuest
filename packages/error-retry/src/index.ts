import { MiddlewareCallback } from '@prequest/types'
import { Options } from './types'

function createDefaultOption<T>(): Options<T> {
  return {
    retryCount: 1,
    retryControl: ({ method }) => /^get$/i.test(method) || !method,
  }
}

export type ErrorRetryInject<T> = Options<T>

export default function errorRetryMiddleware<T, N>(
  opt?: Partial<Options<T>>
): MiddlewareCallback<T & Partial<Options<T>>, N> {
  const options = Object.assign({}, createDefaultOption<T>(), opt)

  return async function(ctx, next, injectOpt) {
    try {
      await next()
    } catch (e) {
      const { retryCount, retryControl } = Object.assign({}, options, ctx.request, injectOpt)

      const control = await retryControl(ctx.request, e as Error)

      if (retryCount < 1 || !control) throw e

      injectOpt!.retryCount = retryCount - 1

      await ctx.context.controller.bind(ctx.context)(ctx, injectOpt)
    }
  }
}
