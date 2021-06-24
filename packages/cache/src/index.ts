import { MiddlewareCallback } from '@prequest/types'
import { Options, CacheValue, CacheKernel } from './types'

export default class CacheMiddleware<T, N> {
  cache: CacheKernel

  constructor(private opt?: Partial<Options<T>>) {
    this.cache = this.opt?.cacheKernel?.() || new Map()
  }

  getId = (value: T) => {
    return this.opt?.cacheId?.(value) || JSON.stringify(value)
  }

  private isExpired = (timestamp: number) => {
    return Date.now() - timestamp > (this.opt?.ttl || 0)
  }

  async clear() {
    return this.cache.clear()
  }

  run: MiddlewareCallback<T, N> = async (ctx, next) => {
    if (!this.opt?.cacheControl?.(ctx.request)) return next()

    const id = this.getId(ctx.request)
    const cache: CacheValue<T, N> = await this.cache.get(id)

    if (cache) {
      if (this.isExpired(cache.timestamp)) {
        await this.cache.delete(id)
      } else {
        ctx = cache.ctx
        return cache.ctx.response
      }
    }

    await next()

    await this.cache.set(id, { timestamp: Date.now(), data: ctx.response })
  }
}
