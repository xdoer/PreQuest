import { MiddlewareCallback, PreQuestError } from '@prequest/types'
import { MiddlewareOptions } from './types'

const defaultOptions: MiddlewareOptions = {
  retryCount: 1,
  retryControl: ({ method }) => /^get$/i.test(method) || !method,
}

export default function errorRetryMiddleware(opt?: MiddlewareOptions): MiddlewareCallback {
  const options = Object.assign({}, defaultOptions, opt)

  return async function(ctx, next, injectOpt) {
    try {
      await next()
    } catch (e) {
      const { retryCount = 1 } = Object.assign({}, options, ctx.request, injectOpt)

      const control = await options.retryControl!(ctx.request, e as PreQuestError)

      if (retryCount < 1 || !control) throw e

      injectOpt!.retryCount = retryCount - 1

      await ctx.context.controller.bind(ctx.context)(ctx, injectOpt)
    }
  }
}
