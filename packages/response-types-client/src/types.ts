import { PreQuestInstance, Common, PQRequest, PQResponse } from '@prequest/types'

type CacheList = string[]

export interface GeneratorServerResponse {
  status: boolean
  timestamp: number
  data: CacheList
  error: Common
}

interface TypesGeneratorConfig {
  data: Common
  outPutName: string
  interfaceName: string
  overwrite: boolean
}

export interface WrapperMiddlewareOptions {
  httpAgent: PreQuestInstance
  outPutDir: string
  typesGeneratorConfig(req: PQRequest, res: PQResponse): TypesGeneratorConfig
  parseResponse?(res: PQResponse): GeneratorServerResponse
  enable?: boolean
}

declare module '@prequest/types' {
  export interface PQRequest {
    rewriteType?: boolean
  }
}
