import { PQRequest } from '@prequest/types'

export interface Options {
  ttl?: number
  getCacheKey?: (opt: PQRequest) => string
  verifyRequest?: (opt: PQRequest) => boolean
  verifyResponse?: (response: any) => any
}

declare module '@prequest/types' {
  export interface PQRequest {
    useCache?: boolean
  }
}
