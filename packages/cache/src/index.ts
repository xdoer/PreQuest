import { merge, AsyncPromise } from '@xdoer/x'
import { PQRequest, Adapter, Config, PQResponse } from '@prequest/types'
import { Options } from './types'

const defaultOptions: Options = {
  ttl: 1000 * 60,
  getCacheKey: (opt: PQRequest) => opt.path,
  verifyRequest: (opt: PQRequest) => !opt.method || opt.method === 'GET',
  verifyResponse: (res: PQResponse) => !!res,
}

export default function (options?: Options) {
  const { ttl, getCacheKey, verifyRequest, verifyResponse } = merge<Required<Options>>(
    defaultOptions,
    options
  )
  return function (core: Adapter): Adapter {
    const caches = new Map<string, { promise: Promise<any>; time: number }>()
    let lastTime: number = 0 // last request time
    return async function (opt: Config) {
      const { useCache = false } = opt
      const _opt = opt as PQRequest

      if (useCache && verifyRequest(_opt)) {
        const cacheKey = getCacheKey!(_opt)
        let cache = caches.get(cacheKey)
        let nowTime: number = Date.now()

        if (cache && nowTime - cache.time < ttl) return cache.promise // if cache is valid
        if (lastTime && nowTime - lastTime > ttl) caches.clear()

        const promise = new AsyncPromise()

        caches.set(cacheKey, { time: nowTime, promise: promise.promise })
        lastTime = nowTime

        try {
          const result = await core(opt) // resolve valid cache promise
          cache = caches.get(cacheKey)
          if (cache) {
            if (verifyResponse(result)) {
              nowTime = Date.now()
              cache.time = nowTime
              lastTime = nowTime
            } else {
              caches.delete(cacheKey)
            }
          }
          promise.resolve(result)
          return result
        } catch (error) {
          if (caches.has(cacheKey)) {
            caches.delete(cacheKey)
          }
          throw error
        }
      }

      return core(opt)
    }
  }
}
