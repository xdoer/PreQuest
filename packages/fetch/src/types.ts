import { BaseOption } from '@prequest/types'

type Options = BaseOption & Partial<globalThis.Request>

export interface Request extends Options {
  requestType?: 'json' | 'form' | ({} & string)
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
