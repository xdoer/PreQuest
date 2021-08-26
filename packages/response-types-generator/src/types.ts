import { Request } from '@prequest/node'

export interface Item {
  requestOptions: Request
  outPutPath?: string
  parseResponse?(res: any): string | Record<string, any>
  rootInterfaceName?: string
}

export interface Options {
  requestOptions: Request
  outPutPath?: string
  requestPoolLimit?: number
  parseResponse?(res: any): string | Record<string, any>
  customRootInterfaceName?(requestOptions: Request): string
  data: Item[]
}
