import { PreQuest, PreQuestInstance } from '@prequest/core'
import { Request, Response } from './types'
import { create } from './create'
import { adapter } from './adapter'

const prequest = create()

export default prequest

export { prequest, create, adapter, Request, Response, PreQuest, PreQuestInstance }
