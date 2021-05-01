export type CommonObject = Record<string, any>


// PreQuest 配置项
export interface Request {
  path?: string
  baseURL?: string
  params?: CommonObject
  requestType?: 'json' | 'form' | ({} & string)
  method?: string
  data?: any
  headers?: Record<string, any>
  timeout?: number
  withCredentials?: boolean
  responseType?: XMLHttpRequestResponseType
}

// 适配器响应数据类型
export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
