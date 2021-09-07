import { CommonObject, UpperMethod } from './common'

export interface BaseOption {
  path?: string
  method?: UpperMethod
  baseURL?: string
  timeout?: number
  params?: CommonObject
  data?: CommonObject
  headers?: CommonObject
  responseType?: 'json' | 'text' | 'arraybuffer' | 'blob' | ({} & string)
}
