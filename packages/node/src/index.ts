import { PreQuest } from '@prequest/core'
import { create } from './create'
import { adapter } from './adapter'
import './types'

const prequest = create()

export default prequest

export { prequest, create, adapter, PreQuest }
