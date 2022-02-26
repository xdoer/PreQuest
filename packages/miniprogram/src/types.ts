import { CommonObject, CancelToken } from '@prequest/types'

export type RequestCore = any

declare module '@prequest/types' {
  interface PreQuestRequest {
    baseURL?: string
    params?: CommonObject
    data?: CommonObject | string | ArrayBuffer
    responseType?: 'json' | 'text' | 'arraybuffer' | ({} & string)
    header?: CommonObject
    dataType?: 'json' | ({} & string)
    getNativeRequestInstance?(value: Promise<RequestCore>): void
    cancelToken?: CancelToken
  }

  interface PreQuestResponse<T = any> {
    data: T
    statusCode: number
    header: CommonObject
  }
}
