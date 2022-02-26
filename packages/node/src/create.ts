import { PreQuest } from '@prequest/core'
import { Adapter, Config } from '@prequest/types'
import { adapter } from './adapter'

export function create(options?: Config, wrapper = (v: Adapter) => v) {
  return PreQuest.create(wrapper(adapter), options)
}
