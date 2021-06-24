import { CommonObject } from './common'

export interface BaseOption {
  path?: string
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS' | ({} & string)
  baseURL?: string
  timeout?: number
  params?: CommonObject
  data?: CommonObject
  headers?: CommonObject
  responseType?: 'json' | 'text' | 'arraybuffer' | ({} & string)
}
