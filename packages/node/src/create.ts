import PreQuest from '@prequest/core'
import { Request, Response } from './types'
import { adapter } from './adapter'

export const create = (options?: Request) => {
  return PreQuest.create<Request, Response>(adapter, options)
}
