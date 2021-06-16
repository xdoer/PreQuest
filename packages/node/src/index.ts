import PreQuest, { PreQuestInstance } from '@prequest/core'
import { Request, Response } from './types'
import { create } from './create'

const prequest = create()

export default prequest

export { prequest, create, Request, Response, PreQuest, PreQuestInstance }
