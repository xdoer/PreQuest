import { PreQuestError, PreQuestRequest } from '@prequest/types'

declare module '@prequest/types' {
  export interface PreQuestRequest {
    retryCount?: number
  }
}

export type RetryControl = (opt: PreQuestRequest, err: PreQuestError) => boolean

export interface MiddlewareOptions {
  retryCount?: number
  retryControl?: RetryControl
}
