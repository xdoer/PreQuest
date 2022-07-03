import { PQRequest, PQResponse } from '@prequest/types'

export interface Options {
  ttl?: number
  getCacheKey?: (opt: PQRequest) => string
  verifyRequest?: (opt: PQRequest) => boolean
  verifyResponse?: (response: PQResponse) => any
}

declare module '@prequest/types' {
  export interface PQRequest {
    useCache?: boolean
  }
}
