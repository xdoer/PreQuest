import { MiddlewareCallback } from '@prequest/types'
import { WrapperMiddlewareOptions, GeneratorServerResponse } from './types'

export { TypesGeneratorInject } from './types'

export default function generatorMiddlewareWrapper<T, N>(
  opt: WrapperMiddlewareOptions<T, N>
): MiddlewareCallback<T, N> {
  const { httpAgent, typesGeneratorConfig, outPutDir, enable = true } = opt

  let cache: string[] = []

  return async (ctx, next) => {
    await next()

    if (!enable) return

    const config = typesGeneratorConfig(ctx.request, ctx.response)
    const { outPutName, overwrite, data, interfaceName } = config
    const { rewriteType } = ctx.request as any

    if (cache.includes(outPutName)) return

    try {
      // @ts-ignore
      const res: GeneratorServerResponse = await httpAgent({
        method: 'POST',
        data: JSON.stringify({
          outPutDir,
          outPutName,
          data,
          interfaceName,
          overwrite: typeof rewriteType === 'undefined' ? overwrite : rewriteType,
        }),
      } as any)

      const { status, error, data: cacheList } = res
      cache = cacheList

      if (!status) throw error
    } catch (e) {
      console.warn(`${outPutName} types generate fail, error detail is:`, e)
    }
  }
}
