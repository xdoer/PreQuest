import { PreQuestInstance, CommonObject, PreQuestRequest, PreQuestResponse } from '@prequest/types'

type CacheList = string[]

export interface GeneratorServerResponse {
  status: boolean
  timestamp: number
  data: CacheList
  error: CommonObject
}

interface TypesGeneratorConfig {
  data: CommonObject
  outPutName: string
  interfaceName: string
  overwrite: boolean
}

export interface WrapperMiddlewareOptions {
  httpAgent: PreQuestInstance
  outPutDir: string
  typesGeneratorConfig(req: PreQuestRequest, res: PreQuestResponse): TypesGeneratorConfig
  parseResponse?(res: PreQuestResponse): GeneratorServerResponse
  enable?: boolean
}

declare module '@prequest/types' {
  export interface PreQuestRequest {
    rewriteType?: boolean
  }
}
