export type CommonObject = Record<string, string>

// 适配器请求选项
export interface RequestOption {
  method?: string

  body?: any

  headers?: Record<string, any>

  timeout?: number

  withCredentials?: boolean

  responseType?: 'arraybuffer' | 'document' | 'json' | 'text'
}

// PreQuest 配置项
export interface Config extends RequestOption {
  path?: string
  baseURL?: string
  params?: CommonObject
  adapter?: Adapter
}

export type Adapter = (url: string, options: RequestOption) => Promise<ResponseSchema>

// 适配器响应数据类型
export interface ResponseSchema {

  data: any

  status: number

  statusText: string

  headers: Record<string, any>
}

// 请求方式
export type ReqMethods = 'get' | 'post'

// 上下文
export type Context = Record<string, any>

// 中间件回调
export type MiddlewareCallback = (ctx: Context, next: any) => Promise<any>
