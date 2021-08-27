import { Request } from '@prequest/node'

export interface Options {
  requestOptions?: Request
  outPutDir?: string
  requestPoolLimit?: number
  parseResponse?(res: any): string | Record<string, any>
  customOutPutFileName?(requestOptions: Request): string
  customRootInterfaceName?(requestOptions: Request): string
  data: Item[]
}

export interface Item {
  path: string
  requestOptions?: Request
  outPutFileName?: string
  rootInterfaceName?: string
  customInterfaceName?(key: string, value: any, data: any): string | void
  parseResponse?(res: any): string | Record<string, any>
}
