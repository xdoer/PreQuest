import { Context } from '@prequest/types'

export interface Cache<T, N> {
  timestamp: number
  ctx: Context<T, N>
}

export interface CacheKernel {
  get(id: any): any
  set(id: any, value: any): void
  delete(id: any): void
}

export interface Options<T> {
  ttl: number
  cacheKernel(): CacheKernel
  cacheControl(opt: T): boolean
  cacheId(opt: T): any
}
