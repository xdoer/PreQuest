import { PreQuest } from '@prequest/core'
import { Request, Response, RequestCore } from './types'
import { adapter } from './adapter'

export function create<T, N>(request: RequestCore, instanceOpt?: Request & Partial<T>) {
  return PreQuest.create<Request & Partial<T>, Response & N>(adapter(request), instanceOpt)
}
