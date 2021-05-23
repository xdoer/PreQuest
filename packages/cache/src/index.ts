import { MiddlewareCallback } from '@prequest/types'

interface CacheKernel {
  get(id: string): Promise<any>
  set(id: string, value: any): void
  delete(id: string): void
  clear(): boolean
}

// TODO: TTL
interface Options<T> {
  ttl: number
  cacheKernel: () => CacheKernel
  validateCache: (opt: T) => boolean
}

export class Cache<T, N> {
  constructor(private opt?: Partial<Options<T>>) {}

  cache = this.opt?.cacheKernel?.() || new Map()

  getId = (value: any) => {
    return JSON.stringify(value)
  }

  run: MiddlewareCallback<T, N> = async (ctx, next) => {
    if (this.opt?.validateCache?.(ctx.request)) return next()

    const id = this.getId(ctx.request)
    const response = await this.cache.get(id)

    if (response) {
      ctx.response = response
      return response
    }

    await next()

    this.cache.set(id, ctx.response)
  }
}
