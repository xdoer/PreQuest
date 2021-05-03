import { BaseOption } from '@prequest/types'

export interface Request extends BaseOption {
  withCredentials?: boolean
  requestType?: 'json' | 'form' | ({} & string)
  responseType?: XMLHttpRequestResponseType
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
