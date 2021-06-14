import { CommonObject, Method, CancelToken } from '@prequest/types'

export type RequestCore = any

export interface Request {
  path?: string
  method?: Method
  baseURL?: string
  timeout?: number
  params?: CommonObject
  data?: CommonObject | string | ArrayBuffer
  responseType?: 'json' | 'text' | 'arraybuffer' | ({} & string)
  header?: CommonObject
  dataType?: 'json' | ({} & string)
  getNativeRequestInstance?(value: Promise<RequestCore>): void
  cancelToken?: CancelToken
}

export interface Response {
  data: string | ArrayBuffer | CommonObject
  statusCode: number
  header: CommonObject
}
