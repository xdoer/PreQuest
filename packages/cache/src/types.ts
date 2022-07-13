import { PQRequest, PQResponse } from '@prequest/types'

export interface Options {
  ttl?: number
  getCacheKey?: (opt: PQRequest) => string
  verifyRequest?: (opt: PQRequest) => boolean
  verifyResponse?: (res: PQResponse) => boolean
}

declare module '@prequest/types' {
  export interface PQRequest {
    useCache?: boolean
  }
}
