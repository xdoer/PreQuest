import { BaseOption, CancelToken } from '@prequest/types'

export interface Request extends BaseOption {
  withCredentials?: boolean
  responseType?: XMLHttpRequestResponseType
  getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
  cancelToken?: CancelToken
  onDownloadProgress?(): void
  onUploadProgress?(): void
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
