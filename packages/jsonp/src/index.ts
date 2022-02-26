import { PreQuest } from '@prequest/core'
import { create } from './create'
import { adapter } from './adapter'

const prequest = create()

export { create, prequest, PreQuest, adapter }

export default prequest
