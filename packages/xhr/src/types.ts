import { BaseOption } from '@prequest/types'
import CancelToken from '@prequest/cancel-token'

export interface Request extends BaseOption {
  withCredentials?: boolean
  requestType?: 'json' | 'form' | ({} & string)
  responseType?: XMLHttpRequestResponseType
  getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
  cancelToken?: CancelToken
  onDownloadProgress?(e: any): void
  onUploadProgress?(e: any): void
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
