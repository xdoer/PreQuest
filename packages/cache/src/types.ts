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
  enable: boolean
  ttl: number
  cacheKernel(): CacheKernel
  cacheControl(opt: T): boolean
  requestId(opt: T): string
}

export interface CacheInject<T, N> {
  ttl?: number
  useCache?: boolean
  validateCache?(req: T, res: N): boolean
}
