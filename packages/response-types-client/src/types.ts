import { PreQuestInstance } from '@prequest/types'
import { Options } from 'json-types-generator'

interface GeneratorServerResponse {
  status: boolean
  timestamp: number
  error: any
}

export interface WrapperMiddlewareOptions<T, N> {
  httpAgent: PreQuestInstance<T, N>
  typesGeneratorConfig(req: T, res: N): Omit<Options, 'customInterfaceName'>
  parseResponse(res: N): GeneratorServerResponse
  enable?: boolean
  requestId?(req: T): string
}
