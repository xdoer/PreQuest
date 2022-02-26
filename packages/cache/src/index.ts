import { Adapter, PreQuestRequest } from '@prequest/types'
import { Options } from './types'

function getOptions(options?: Options): Required<Options> {
  return Object.assign(
    {},
    {
      ttl: 60000,
      cacheKernel: new Map<string, string>(),
      getCacheKey: (opt: any) => opt.path,
      validateCache: (opt: any) => !opt.method || opt.method === 'GET',
    },
    options
  )
}

export default function(options?: Options) {
  const { cacheKernel, getCacheKey, ttl, validateCache } = getOptions(options)
  return function(core: Adapter): Adapter {
    return async function(opt: PreQuestRequest) {
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
