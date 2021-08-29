import { PreQuestInstance } from '@prequest/types'
import { Options } from 'json-types-generator'

export interface WrapperMiddlewareOptions<T, N> {
  requestAgent: PreQuestInstance<T, N>
  endpoint: string
  typesGeneratorConfig(req: T, res: N): Partial<Options>
}
