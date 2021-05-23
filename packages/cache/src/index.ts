interface CacheKernel {
  get(id: string): Promise<any>
  set(id: string, value: any): void
  delete(id: string): void
  clear(): boolean
}

// TODO: TTL
interface Options {
  ttl: number
  cacheKernel: () => CacheKernel
}

export class Cache {
  constructor(private opt?: Partial<Options>) {}

  cache = this.opt?.cacheKernel?.() || new Map()

  getId = (value: any) => {
    return JSON.stringify(value)
  }

  run = async (ctx: any, next: any) => {
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
