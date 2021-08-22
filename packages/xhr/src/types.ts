import { BaseOption, CancelToken } from '@prequest/types'

export interface Request extends BaseOption {
  withCredentials?: boolean
  requestType?: 'json' | 'form' | ({} & string)
  responseType?: XMLHttpRequestResponseType
  getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
  cancelToken?: CancelToken
  onDownloadProgress?(e: any): void
  onUploadProgress?(e: any): void
}

export interface Response<D = any> {
  data: D
  status: number
  statusText: string
  headers: Record<string, any>
}
