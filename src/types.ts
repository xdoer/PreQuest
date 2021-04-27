export interface Config {
  method?: string
  path?: string
  adapter?: any
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
  headers?: Record<string, string>
  responseType?: XMLHttpRequestResponseType
}

export type ReqMethods = 'get' | 'post'

// export interface Context {

// }

export type Context = Record<string, any>

export type MiddlewareCallback = (ctx: Context, next: any) => any
