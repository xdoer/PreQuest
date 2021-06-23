import { PreQuest } from '@prequest/core'
import { baseOption } from '@prequest/helper'
import { merge } from '@prequest/utils'
import { Request, Response } from './types'
import { adapter } from './adapter'

export function create<T, N>(options?: Request & Partial<T>) {
  return PreQuest.create<Request & Partial<T>, Response & N>(adapter(), merge(baseOption, options))
}
