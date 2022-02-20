import { PreQuestInstance, CommonObject } from '@prequest/types'

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

export interface WrapperMiddlewareOptions<T, N> {
  httpAgent: PreQuestInstance<T, N>
  outPutDir: string
  typesGeneratorConfig(req: T, res: N): TypesGeneratorConfig
  parseResponse?(res: N): GeneratorServerResponse
  enable?: boolean
}

export interface TypesGeneratorInject {
  rewriteType?: boolean
}
