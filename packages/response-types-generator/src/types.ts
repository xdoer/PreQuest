import { PreQuestRequest } from '@prequest/types'

export interface Options {
  requestOptions?: PreQuestRequest
  outPutDir?: string
  requestPoolLimit?: number
  parseResponse?(res: any): string | Record<string, any>
  customOutPutFileName?(requestOptions: PreQuestRequest): string
  customRootInterfaceName?(requestOptions: PreQuestRequest): string
  data: Item[]
}

export interface Item {
  path: string
  requestOptions?: PreQuestRequest
  outPutFileName?: string
  rootInterfaceName?: string
  customInterfaceName?(key: string, value: any, data: any): string | void
  parseResponse?(res: any): string | Record<string, any>
}
