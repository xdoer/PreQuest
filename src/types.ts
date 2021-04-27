export interface Config {
  method?: string
  path?: string
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
  headers?: Record<string, string>
  responseType?: XMLHttpRequestResponseType
}

export type ReqMethods = 'get' | 'post'
