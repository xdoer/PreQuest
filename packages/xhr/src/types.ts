/// <reference types="@prequest/types" />
import CancelToken from '@prequest/cancel-token'

declare module '@prequest/types' {
  interface PQRequest extends PQ.PresetOption {
    timeout?: number
    withCredentials?: boolean
    requestType?: 'json' | 'form' | ({} & string)
    responseType?: XMLHttpRequestResponseType
    getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
    cancelToken?: CancelToken
    onDownloadProgress?(e: any): void
    onUploadProgress?(e: any): void
  }

  interface PQResponse<T> {
    data: T
    status: number
    statusText: string
    headers: PQ.Common
  }
}
