import { BaseOption, CancelToken, CommonObject } from '@prequest/types'

declare module '@prequest/types' {
  interface PreQuestRequest extends BaseOption {
    timeout?: number
    withCredentials?: boolean
    requestType?: 'json' | 'form' | ({} & string)
    responseType?: XMLHttpRequestResponseType
    getNativeRequestInstance?(promise: Promise<XMLHttpRequest>): void
    cancelToken?: CancelToken
    onDownloadProgress?(e: any): void
    onUploadProgress?(e: any): void
  }

  interface PreQuestResponse<T> {
    data: T
    status: number
    statusText: string
    headers: CommonObject
  }
}
