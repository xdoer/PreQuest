import { PreQuest } from '@prequest/core'
import { Request, Response, RequestCore } from './types'
import { adapter } from './adapter'

export function create<T, N>(request: RequestCore, instanceOpt?: Partial<Request & T>) {
  return PreQuest.create<Partial<Request & T>, Response & N>(
    adapter<Partial<Request & T>, Response & N>(request),
    instanceOpt
  )
}
