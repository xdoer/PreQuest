import { UpperMethod } from '@prequest/types'

type CommonObj = Record<string, any>

export interface IItem {
  path: string
  method?: UpperMethod
  headers?: CommonObj
  outPutPath?: string
  parseResponse?(res: any): any
}

export interface Schema {
  baseURL?: string
  method?: UpperMethod
  headers?: CommonObj
  outPutPath?: string
  parseResponse?(res: any): any
  data: IItem[]
}

export interface Options {
  schema: Schema
  requestPoolLimit?: number // 同时请求接口的数量
  customRootInterfaceName?(reqPath: string): string
}
