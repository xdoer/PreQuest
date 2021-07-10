import { MiddlewareCallback } from '@prequest/types'
import { Options, Cache } from './types'

export interface CacheInject {
  useCache?: boolean
}

function createDefaultOption<T>(): Options<T> {
  return {
    ttl: 1000,
    cacheKernel: () => new Map(),
    cacheControl: () => false,
    cacheId: v => JSON.stringify(v),
  }
}

export default function cacheMiddleware<T, N>(
  opt?: Partial<Options<T>>
): MiddlewareCallback<T & CacheInject, N> {
  const { ttl, cacheControl, cacheId, cacheKernel } = Object.assign(
    {},
    createDefaultOption<T>(),
    opt
  )

  const cache = cacheKernel()

  const isExpired = (timestamp: number) => Date.now() - timestamp > ttl

  return async function(ctx, next) {
    const setCacheKey = typeof ctx.request.useCache !== 'undefined'

    // 如果设置了 useCache 字段，且设置为 false
    if (setCacheKey) {
      if (!ctx.request.useCache) return next()
    }

    // 如果没设置 useCache，则使用默认的统一控制
    if (!setCacheKey) {
      const control = await cacheControl(ctx.request)
      if (!control) return next()
    }

    const id = cacheId(ctx.request)
    const cacheValue: Cache<T, N> = await cache.get(id)

    if (cacheValue) {
      if (isExpired(cacheValue.timestamp)) {
        await cache.delete(id)
      } else {
        ctx = cacheValue.ctx
        return cacheValue.ctx.response
      }
    }

    await next()

    await cache.set(id, { timestamp: Date.now(), ctx })
  }
}
