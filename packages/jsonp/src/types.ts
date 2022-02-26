import { CommonObject, CancelToken } from '@prequest/types'

declare module '@prequest/types' {
  interface PreQuestRequest {
    baseURL?: string
    params?: CommonObject
    callbackParamName?: string
    cancelToken?: CancelToken
  }
  interface PreQuestResponse<T = any> {
    data: T
    statusCode: number
  }
}
