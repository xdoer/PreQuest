import { Context } from '@prequest/types'

export interface CacheValue<T, N> {
  timestamp: number
  ctx: Context<T, N>
}

export interface CacheKernel {
  get(id: any): any
  set(id: any, value: any): void
  delete(id: any): void
  clear(): void
}

export interface Options<T> {
  ttl: number
  cacheKernel(): CacheKernel
  cacheControl(opt: T): boolean
  cacheId(opt: T): any
}
