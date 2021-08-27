import { Request } from '@prequest/node'

export interface Item {
  requestOptions: Request
  outPutPath?: string
  rootInterfaceName?: string
  customInterfaceName?(key: string, value: any, data: any): string | void
  parseResponse?(res: any): string | Record<string, any>
}

export interface Options {
  requestOptions: Request
  outPutDir?: string
  outPutPath?: string
  requestPoolLimit?: number
  parseResponse?(res: any): string | Record<string, any>
  customRootInterfaceName?(requestOptions: Request): string
  data: Item[]
}
