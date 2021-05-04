import { BaseOption, CommonObject } from '@prequest/types'

export interface Request extends BaseOption {
  dataType?: 'json' | {} & string
  getRequestInstance(instance: any): void
}

export interface Response {
  data: string | ArrayBuffer | CommonObject
  statusCode: number
  header: CommonObject
}
