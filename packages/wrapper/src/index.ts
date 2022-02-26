import { PreQuest } from '@prequest/core'
import { Adapter } from '@prequest/types'

export function wrapper(adapter: Adapter) {
  return PreQuest.create(adapter)
}

export default wrapper
