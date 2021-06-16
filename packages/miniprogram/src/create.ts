import PreQuest from '@prequest/core'
import { Request, Response, RequestCore } from './types'
import { adapter } from './adapter'

export function create<T, N>(request: RequestCore, instanceOpt?: Request & T) {
  return PreQuest.create<Request & T, Response & N>(adapter<T, N>(request), instanceOpt)
}
