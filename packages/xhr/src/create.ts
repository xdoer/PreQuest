import { PreQuest } from '@prequest/core'
import { baseOption } from '@prequest/helper'
import { merge } from '@xdoer/x'
import { adapter } from './adapter'
import { Adapter, Config } from '@prequest/types'

export function create(options?: Config, wrapper = (v: Adapter) => v) {
  return PreQuest.create(wrapper(adapter), merge(baseOption, options))
}
