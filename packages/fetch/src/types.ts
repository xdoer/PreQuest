import { BaseOption, CancelToken } from '@prequest/types'

export interface Request extends BaseOption {
  requestType?: 'json' | 'form' | ({} & string)
  cancelToken?: CancelToken
  onDownloadProgress?(e: { loaded: number; total: number }): void
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
