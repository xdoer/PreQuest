import { PreQuest } from '@prequest/core'
import { create } from './create'
import { adapter } from './adapter'

const prequest = create()

export default prequest

export { prequest, create, PreQuest, adapter }
