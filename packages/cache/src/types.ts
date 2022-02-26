import { PreQuestRequest } from '@prequest/types'

interface CacheValue {
  createdAt: number
  data: any
}

type GetValue = (key: string) => Promise<CacheValue | null>
type SetValue = (key: string, value: CacheValue) => void

export interface Options {
  ttl?: number
  getCacheKey?: (opt: PreQuestRequest) => string
  validateCache?: (opt: PreQuestRequest) => boolean
  cacheKernel?: {
    get: GetValue
    set: SetValue
  }
}

declare module '@prequest/types' {
  export interface PreQuestRequest {
    useCache?: boolean
  }
}
