import { PreQuest } from '@prequest/core'
import { RequestCore } from './types'
import { adapter } from './adapter'
import { Adapter, Config } from '@prequest/types'

export function create(core: RequestCore, options?: Config, wrapper = (v: Adapter) => v) {
  return PreQuest.create(wrapper(adapter(core)), options)
}
