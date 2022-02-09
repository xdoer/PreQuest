import { Request, Response } from './types'
import { PreQuest, PreQuestInstance } from '@prequest/core'
import { create } from './create'
import { adapter } from './adapter'

const prequest = create()

export { create, prequest, PreQuest, Request, Response, PreQuestInstance, adapter }

export default prequest
