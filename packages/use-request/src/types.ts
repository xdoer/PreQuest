import { PreQuestRequest, PreQuestResponse } from '@prequest/types'

export type GlobalCache = { [key: string]: Cache }

interface ToFetchConfig<Q> {
  onUpdate?: (prev: PreQuestResponse<Q>, value: PreQuestResponse<Q>) => PreQuestResponse<Q>
}

export type Cache<Q = any> = {
  called: boolean
  valid: boolean
  loading: boolean
  error: any
  request: PreQuestRequest
  response: PreQuestResponse<Q>
  stopLoop(): void
  toFetch(
    opt?: PreQuestRequest | ((o: PreQuestRequest) => PreQuestRequest),
    config?: ToFetchConfig<Q>
  ): void
  deps: any[]
  depsIsChanged: boolean
}

export interface Config<Q = any> {
  key?: string
  deps?: any[]
  lazy?: boolean
  loop?: number
  onUpdate?: (prev: PreQuestResponse<Q>, value: PreQuestResponse<Q>) => PreQuestResponse<Q>
}
