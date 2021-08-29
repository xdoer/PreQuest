import { MiddlewareCallback } from '@prequest/types'
import { WrapperMiddlewareOptions } from './types'

export default function generatorMiddlewareWrapper<T, N>(
  opt: WrapperMiddlewareOptions<T, N>
): MiddlewareCallback<T, N> {
  const { endpoint, requestAgent, typesGeneratorConfig } = opt
  return async (ctx, next) => {
    await next()

    if (process.env.NODE_ENV === 'production') return

    try {
      const res = await requestAgent.post(endpoint, {
        data: JSON.stringify(typesGeneratorConfig(ctx.request, ctx.response)),
      } as any)
      console.log('generate success', res)
    } catch (e) {
      console.log('generate fail')
    }
  }
}
