import { PQRequest } from '@prequest/types'

export interface Options {
  requestOptions?: PQRequest
  outPutDir?: string
  requestPoolLimit?: number
  parseResponse?(res: any): string | Record<string, any>
  customOutPutFileName?(requestOptions: PQRequest): string
  customRootInterfaceName?(requestOptions: PQRequest): string
  data: Item[]
}

export interface Item {
  path: string
  requestOptions?: PQRequest
  outPutFileName?: string
  rootInterfaceName?: string
  customInterfaceName?(key: string, value: any, data: any): string | void
  parseResponse?(res: any): string | Record<string, any>
}
