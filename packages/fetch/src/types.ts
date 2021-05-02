export type CommonObject = Record<string, any>

export interface Request {
  path?: string
  baseURL?: string
  params?: CommonObject
  requestType?: 'json' | 'form' | ({} & string)
  method?: string
  data?: any
  headers?: Record<string, any>
  timeout?: number
  responseType?: XMLHttpRequestResponseType
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
