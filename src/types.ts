import { METHODS } from './constant'

export type Methods = { [k in typeof METHODS[number]]: (path: string, option: Config) => Promise<Response> }

export type CommonObject = Record<string, string>

// 适配器请求选项
export interface AdapterRequest {
  method: string

  data: any

  headers: Record<string, any>

  timeout: number

  injectAdapterInstance?(url: string, opt: AdapterRequest): Promise<any>
}

// PreQuest 配置项
export interface Request extends Partial<AdapterRequest> {
  path?: string
  baseURL?: string
  params?: CommonObject
  requestType?: 'json' | 'form' | ({} & string)
}

export interface Config extends Request {
  adapter?: Adapter
}

export type Adapter = (url: string, options: AdapterRequest) => Promise<Response>

// 适配器响应数据类型
export interface Response {

  data: any

  status: number

  statusText: string

  headers: Record<string, any>
}

// 上下文
export interface Context {
  request: Request
  response: Partial<Response>
  adapter: Adapter
}

// 中间件回调
export type MiddlewareCallback = (ctx: Context, next: () => Promise<any>) => Promise<any>
