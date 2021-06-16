import { BaseOption } from '@prequest/types'

export interface Request extends BaseOption {}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
