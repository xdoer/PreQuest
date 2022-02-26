import { Method } from './common'

export type MethodsCallback = {
  [k in Method]: <Q>(path: string, option?: Config) => Promise<PreQuestResponse<Q>>
}

export type Config = Partial<PreQuestRequest>

export interface PreQuestRequest {
  path: string
  method: string
}

export interface PreQuestResponse<T = any> {}

export interface PreQuestError extends Error {}

export type Adapter = (options: PreQuestRequest) => Promise<PreQuestResponse>

export interface Context {
  request: PreQuestRequest
  response: PreQuestResponse
  context: PreQuest
}

export type MiddlewareInjectOptions = Record<string, any>

export type MiddlewareCallback = (
  ctx: Context,
  next: () => Promise<any>,
  opt?: MiddlewareInjectOptions
) => Promise<any>

export class PreQuest {
  request(path: string | Config, config?: Config): Promise<PreQuestResponse>
  controller(ctx: Context, opt?: MiddlewareInjectOptions): Promise<PreQuestResponse>
  use(cb: MiddlewareCallback): this
  static create(adapter: Adapter, config?: Config): PreQuestInstance
  static defaults: Config
}

export type PreQuestFn = <Q = any>(
  path: string | Config,
  config?: Config
) => Promise<PreQuestResponse<Q>>
export type PreQuestBaseInstance = PreQuest & MethodsCallback
export type PreQuestInstance = PreQuestBaseInstance & PreQuestFn
