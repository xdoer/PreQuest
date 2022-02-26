import { PreQuestRequest } from '@prequest/types'

export interface TimeoutOptions {
  timeout: number
  timeoutControl(opt: PreQuestRequest): boolean
}

declare module '@prequest/types' {
  export interface PreQuestRequest {
    timeout?: number
  }
}
