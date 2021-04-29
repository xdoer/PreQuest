
export interface RequestOption {
  // 'method' is the request method to be used when making the request
  method?: string

  // 'data' is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // Must be of one of the following types:
  // 1. string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // 2. Browser only: FormData, File, Blob
  // 3. Node only: Stream
  body?: any

  // 'params' are the URL parameters to be sent with request
  // Must be a plain object
  // params?: Record<string, string> | URLSearchParams
  params?: Record<string, string>

  headers?: Record<string, any>

  timeout?: number

  withCredentials?: boolean

  responseType?: XMLHttpRequestResponseType
}

export interface ResponseSchema {
  // 'data' is the response that was provided by the server
  data: Record<string, any>

  // 'status' is the HTTP status code from the server response
  status: number

  // 'statusText' is the HTTP status message from the server response
  statusText: string

  // 'headers' the headers that the server responded with
  // All header names are lower cased
  headers: Record<string, any>
}

export interface Config {
  method?: string
  path?: string
  adapter?: any
  baseURL?: string
  timeout?: number
  withCredentials?: boolean
  headers?: Record<string, string>
  responseType?: XMLHttpRequestResponseType
  body?: any
  params?: any
}

export type ReqMethods = 'get' | 'post'

export type Context = Record<string, any>

export type MiddlewareCallback = (ctx: Context, next: any) => any
