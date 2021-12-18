import { Adapter, RequestOption } from '@prequest/types'
import { Options } from './types'

function getOptions<T>(options?: Options<T>): Required<Options<T>> {
  return Object.assign(
    {},
    {
      ttl: 60000,
      cacheKernel: new Map<string, string>(),
      getCacheKey: (opt: any) => opt.path,
      validateCache: (opt: any) => !opt.method || opt.method === 'GET'
    },
    options
  )
}

export { CacheInject } from './types'

export default function <T, N>(options?: Options<T>) {
  const { cacheKernel, getCacheKey, ttl, validateCache } = getOptions<T>(options)
  return function (core: Adapter<T, N>): Adapter<T, N> {
    return async function (opt: RequestOption<T>) {
      const { useCache = false } = opt as any

      if (useCache && validateCache(opt)) {
        const cacheKey = getCacheKey(opt)
        const value = await cacheKernel.get(cacheKey)
        if (value) {
          const { createdAt, data } = value
          if (Date.now() - createdAt < ttl) return data
        }
        const newValue = await core(opt)
        await cacheKernel.set(cacheKey, { createdAt: Date.now(), data: newValue })
        return newValue
      }

      return core(opt)
    }
  }
}
