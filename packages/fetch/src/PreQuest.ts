import { PreQuestBase, PreQuestBaseInstance } from '@prequest/core'
import { Request, Response } from './types'
import { adapter } from './adapter'

export class PreQuest extends PreQuestBase<Request, Response> {
  constructor() {
    super(adapter)
  }
}

export type PreQuestInstance = PreQuest &
  PreQuestBaseInstance<Request, Response> &
  ((path: string | Request, config?: Request) => Promise<Response>)
