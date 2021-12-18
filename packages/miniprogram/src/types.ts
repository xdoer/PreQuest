import { CommonObject, UpperMethod, CancelToken, RequestOption } from '@prequest/types'

export type RequestCore = any

export interface Request {
  path?: string
  method?: UpperMethod
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

export type Adapter<T, N> = (opt: RequestOption<T>) => Promise<N>
export type GetAdapter<T, N> = (adapter: Adapter<T, N>) => Adapter<T, N>
