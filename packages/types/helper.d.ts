import { Method } from './core'
import { CommonObject } from './common'

export interface BaseOption {
  path?: string
  method?: Method
  baseURL?: string
  timeout?: number
  params?: CommonObject
  data?: CommonObject
  headers?: CommonObject
  responseType?: "json" | "text" | "arraybuffer" | ({} & string)
}
