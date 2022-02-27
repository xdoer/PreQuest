/// <reference types="@prequest/types" />
import CancelToken from '@prequest/cancel-token'

export type RequestCore = any

declare module '@prequest/types' {
  interface PQRequest {
    baseURL?: string
    params?: PQ.Common
    data?: PQ.Common | string | ArrayBuffer
    responseType?: 'json' | 'text' | 'arraybuffer' | ({} & string)
    header?: PQ.Common
    dataType?: 'json' | ({} & string)
    getNativeRequestInstance?(value: Promise<RequestCore>): void
    cancelToken?: CancelToken
  }

  interface PQResponse<T = any> {
    data: T
    statusCode: number
    header: PQ.Common
  }
}
