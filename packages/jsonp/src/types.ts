import { CommonObject, CancelToken } from '@prequest/types'

export interface Request {
  path?: string
  baseURL?: string
  params?: CommonObject
  callbackParamName?: string
  cancelToken?: CancelToken
}

export interface Response {
  data: string | ArrayBuffer | CommonObject
  statusCode: number
}
