import { MiddlewareCallback, UpperMethod } from '@prequest/types'
import { requestId } from '@prequest/helper'
import { Options, Cache, CacheInject } from './types'

export { CacheInject } from './types'

function createDefaultOption<T>(): Options<T> {
  return {
    enable: false,
    ttl: 1000,
    requestId,
    cacheKernel: () => new Map(),
    cacheControl: (opt: T & { method: UpperMethod }) => opt.method === 'GET' || !opt.method,
  }
}

export default function cacheMiddleware<T extends CacheInject<T, N>, N>(
  opt?: Partial<Options<T>>
): MiddlewareCallback<T, N> {
  const { ttl: defaultTTL, requestId, cacheKernel, enable, cacheControl } = Object.assign(
    createDefaultOption<T>(),
    opt
  )

  const cache = cacheKernel()

  return async function(ctx, next) {
    const { ttl = defaultTTL, useCache = enable, validateCache = () => true } = ctx.request

    if (!useCache || !cacheControl(ctx.request)) return next()

    const id = requestId(ctx.request)
    const cacheValue: Cache<T, N> = await cache.get(id)

    if (cacheValue) {
      const {
        timestamp,
        ctx: { request, response },
      } = cacheValue

      const isExpired = Date.now() - timestamp > ttl

      if (!isExpired && validateCache(request, response)) {
        ctx = cacheValue.ctx
        return response
      }

      await cache.delete(id)
    }

    await next()

    await cache.set(id, { timestamp: Date.now(), ctx })
  }
}
