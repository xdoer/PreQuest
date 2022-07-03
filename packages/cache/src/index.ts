import { merge, createAsyncPromise, fallback } from '@xdoer/x'
import { PQRequest, Adapter, Config } from '@prequest/types'
import { Options } from './types'

const defaultOptions: Options = {
  ttl: 1000 * 60,
  getCacheKey: (opt: PQRequest) => opt.path,
  verifyRequest: (opt: PQRequest) => !opt.method || opt.method === 'GET',
  verifyResponse: fallback,
}

export default function(options?: Options) {
  const { getCacheKey, ttl, verifyRequest, verifyResponse } = merge<Required<Options>>(
    defaultOptions,
    options
  )
  return function(core: Adapter): Adapter {
    const caches = new Map<string, { promise: Promise<any>; time: number }>()
    return async function(opt: Config) {
      const { useCache = false } = opt
      const _opt = opt as PQRequest

      if (useCache && verifyRequest(_opt)) {
        const cacheKey = getCacheKey!(_opt)
        const cache = caches.get(cacheKey)

        // if cache is valid
        if (cache && Date.now() - cache.time < ttl) return cache.promise

        const promise = createAsyncPromise()

        caches.set(cacheKey, { time: Date.now(), promise: promise.promise })

        try {
          const value = await verifyResponse(await core(opt))
          promise.resolve(value)
          return value
        } catch (e) {
          promise.reject(e)
          throw e
        }
      }

      return core(opt)
    }
  }
}
