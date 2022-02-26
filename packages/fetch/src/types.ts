import { BaseOption, CancelToken, CommonObject } from '@prequest/types'

declare module '@prequest/types' {
  interface PreQuestRequest extends BaseOption {
    requestType?: 'json' | 'form' | ({} & string)
    cancelToken?: CancelToken
    onDownloadProgress?(e: { loaded: number; total: number }): void
    headers?: CommonObject
    responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | ({} & string)
  }

  interface PreQuestResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: CommonObject
  }
}
