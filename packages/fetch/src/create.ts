import PreQuest from '@prequest/core'
import { baseOption } from '@prequest/helper'
import { merge } from '@prequest/utils'
import { adapter } from './adapter'
import { Request, Response } from './types'

export const create = (options?: Request) => {
  return PreQuest.create<Request, Response>(adapter, merge(baseOption, options))
}
