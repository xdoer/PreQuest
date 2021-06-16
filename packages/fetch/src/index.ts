import { PreQuestInstance } from '@prequest/core'
import { create } from './create'
import { Request, Response } from './types'

const prequest: any = create()
prequest.create = create

export default prequest as PreQuestInstance<Request, Response> & Inject

export { Request, Response }

interface Inject {
  create: (opt?: Request) => PreQuestInstance<Request, Response>
}
