import { PreQuest, PreQuestInstance } from '@prequest/core'
import { create } from './create'
import { Request, Response } from './types'

const prequest = create()

export default prequest

export { prequest, create, Request, Response, PreQuest, PreQuestInstance }
