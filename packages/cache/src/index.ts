import { merge, createAsyncPromise } from '@xdoer/x'
import { PQRequest, Adapter, Config } from '@prequest/types'
import { Options } from './types'

const defaultOptions = {
  ttl: 1000 * 60,
  getCacheKey: (opt: PQRequest) => opt.path,
  validateCache: (opt: PQRequest) => !opt.method || opt.method === 'GET',
}

export default function(options?: Options) {
  const { getCacheKey, ttl, validateCache } = merge(defaultOptions, options)
  return function(core: Adapter): Adapter {
    const caches = new Map<string, { promise: Promise<any>; time: number }>()
    return async function(opt: Config) {
      const { useCache = false } = opt

      if (useCache && validateCache(opt)) {
        const cacheKey = getCacheKey(opt)
        const cache = caches.get(cacheKey)

        // if cache is valid
        if (cache && Date.now() - cache.time < ttl) return cache.promise

        const promise = createAsyncPromise()

        caches.set(cacheKey, { time: Date.now(), promise: promise.promise })

        const newValue = await core(opt)

        // resolve valid cache promise
        promise.resolve(newValue)

        return newValue
      }

      return core(opt)
    }
  }
}
