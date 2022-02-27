import { PQRequest } from '@prequest/types'

interface CacheValue {
  createdAt: number
  data: any
}

type GetValue = (key: string) => Promise<CacheValue | null>
type SetValue = (key: string, value: CacheValue) => void

export interface Options {
  ttl?: number
  getCacheKey?: (opt: PQRequest) => string
  validateCache?: (opt: PQRequest) => boolean
  cacheKernel?: {
    get: GetValue
    set: SetValue
  }
}

declare module '@prequest/types' {
  export interface PQRequest {
    useCache?: boolean
  }
}
