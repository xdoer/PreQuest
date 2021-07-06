import { PreQuest, PreQuestInstance } from '@prequest/core'
import { Request, Response } from './types'
import { create } from './create'

const prequest = create()

export { create, prequest, PreQuest, Request, Response, PreQuestInstance }

export default prequest
