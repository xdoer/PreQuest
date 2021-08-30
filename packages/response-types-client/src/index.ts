import { MiddlewareCallback } from '@prequest/types'
import { requestId as defaultRequestId } from '@prequest/helper'
import { WrapperMiddlewareOptions } from './types'

export default function generatorMiddlewareWrapper<T, N>(
  opt: WrapperMiddlewareOptions<T, N>
): MiddlewareCallback<T, N> {
  const {
    parseResponse,
    httpAgent,
    typesGeneratorConfig,
    requestId = defaultRequestId,
    enable = true,
  } = opt
  const cache: string[] = []

  return async (ctx, next) => {
    await next()

    if (!enable) return

    const id = requestId(ctx.request)
    if (cache.includes(id)) return

    try {
      const res = await httpAgent({
        method: 'POST',
        data: JSON.stringify(typesGeneratorConfig(ctx.request, ctx.response)),
      } as any)

      const { status, error } = parseResponse(res)

      if (!status) throw error
      cache.push(id)
    } catch (e) {
      console.warn(`${id} types generate fail, error detail is:`, e)
    }
  }
}
