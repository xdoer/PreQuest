import { PreQuestBase } from '@prequest/core'
import { Request, Response } from './types'
import { baseOption } from '@prequest/helper'
import { merge } from '@prequest/utils'
import { adapter } from './adapter'

export const create = (options?: Request) => {
  return PreQuestBase.createInstance<Request, Response>(adapter, merge(baseOption, options))
}
