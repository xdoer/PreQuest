import { PQError, PQRequest } from '@prequest/types'

export type RetryControl = (opt: PQRequest, err: PQError) => boolean

export interface MiddlewareOptions {
  retryCount?: number
  retryControl?: RetryControl
}

declare module '@prequest/types' {
  export interface PQRequest {
    retryCount?: number
  }
}
