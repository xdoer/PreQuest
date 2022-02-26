import { PreQuest } from '@prequest/core'
import { Config } from '@prequest/types'
import { adapter } from './adapter'

export function create(options?: Config) {
  return PreQuest.create(adapter(), options)
}
