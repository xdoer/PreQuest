import { PreQuestRequest } from '@prequest/types'

export type RetryControl<T> = (opt: PreQuestRequest<T>, e?: Error) => boolean

export interface Options<T> {
  retryCount: number
  retryControl: RetryControl<T>
}

declare module '@prequest/types' {
  export interface PreQuestRequest {
    retryCount: number
    retryControl: RetryControl<PreQuestRequest>
  }
}
