import { MiddlewareCallback } from '@prequest/types'
import { WrapperMiddlewareOptions } from './types'

export default function generatorMiddlewareWrapper<T, N>(
  opt: WrapperMiddlewareOptions<T, N>
): MiddlewareCallback<T, N> {
  const {
    httpAgent,
    typesGeneratorConfig,
    outPutDir,
    enable = true,
    parseResponse = d => d as any,
  } = opt

  let cache: string[] = []

  return async (ctx, next) => {
    await next()

    if (!enable) return

    const config = typesGeneratorConfig(ctx.request, ctx.response)
    const { outPutName, overwrite, data, interfaceName } = config

    if (cache.includes(outPutName)) return

    try {
      const res = await httpAgent({
        method: 'POST',
        data: JSON.stringify({ outPutDir, outPutName, overwrite, data, interfaceName }),
      } as any)

      const { status, error, data: cacheList } = parseResponse(res)
      cache = cacheList

      if (!status) throw error
    } catch (e) {
      console.warn(`${outPutName} types generate fail, error detail is:`, e)
    }
  }
}
