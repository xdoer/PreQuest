import { merge } from '@xdoer/x'
import { PQRequest, Adapter, Config } from '@prequest/types'
import { Options } from './types'

const defaultOptions = {
  ttl: 1000 * 60,
  cacheKernel: new Map<string, string>(),
  getCacheKey: (opt: PQRequest) => opt.path,
  validateCache: (opt: PQRequest) => !opt.method || opt.method === 'GET',
}

export default function(options?: Options) {
  const { cacheKernel, getCacheKey, ttl, validateCache } = merge(defaultOptions, options)
  return function(core: Adapter): Adapter {
    return async function(opt: Config) {
      const { useCache = false } = opt

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
