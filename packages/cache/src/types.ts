import { RequestOption } from '@prequest/types'

interface CacheValue {
  createdAt: number
  data: any
}

type GetValue = (key: string) => Promise<CacheValue | null>
type SetValue = (key: string, value: CacheValue) => void

export interface Options<T> {
  ttl?: number,
  getCacheKey?: (opt: RequestOption<T>) => string
  validateCache?: (opt: RequestOption<T>) => boolean
  cacheKernel?: {
    get: GetValue
    set: SetValue
  }
}

export interface CacheInject {
  useCache: boolean
}
