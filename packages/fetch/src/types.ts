import { BaseOption, CancelToken } from '@prequest/types'
export interface Request extends BaseOption {
  requestType?: 'json' | 'form' | ({} & string)
  cancelToken?: CancelToken
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
