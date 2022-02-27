/// <reference types="@prequest/types" />
import CancelToken from '@prequest/cancel-token'

declare module '@prequest/types' {
  interface PQRequest {
    baseURL?: string
    params?: PQ.Common
    callbackParamName?: string
    cancelToken?: CancelToken
  }
  interface PQResponse<T = any> {
    data: T
    statusCode: number
  }
}
