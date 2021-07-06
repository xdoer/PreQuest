import { PreQuest } from '@prequest/core'
import { Request, Response } from './types'
import { adapter } from './adapter'

export function create<T, N>(instanceOpt?: Request & Partial<T>) {
  return PreQuest.create<Request & Partial<T>, Response & N>(adapter(), instanceOpt)
}
