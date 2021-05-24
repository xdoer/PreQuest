export interface CacheValue<N> {
  timestamp: number
  data: N
}

export interface CacheKernel {
  get(id: string): any
  set(id: string, value: any): void
}

export interface Options<T> {
  ttl: number
  cacheKernel(): CacheKernel
  validateCache(opt: T): boolean
  cacheId(opt: T): any
}
