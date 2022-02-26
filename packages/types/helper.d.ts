import { CommonObject, UpperMethod } from './common'

export interface BaseOption {
  path?: string
  method?: UpperMethod
  baseURL?: string
  params?: CommonObject
  data?: CommonObject
}
