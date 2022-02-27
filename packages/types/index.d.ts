export = PQ
export as namespace PQ

declare namespace PQ {
  type Common<T = any> = Record<string, T>

  type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

  type UpperMethod = Uppercase<Method> | ({} & string)

  interface PQRequest {
    path: string
    method: string
  }

  interface PQResponse<T = any> {}

  interface PQError extends Error {}

  type MethodsCallback = {
    [k in Method]: <Q>(path: string, option?: Config) => Promise<PQResponse<Q>>
  }

  type Config = Partial<PQRequest>

  type Adapter = (options: Config) => Promise<PQResponse>

  interface Context {
    request: PQRequest
    response: PQResponse
    context: PreQuest
  }

  type MiddlewareInjectOptions = Common

  type MiddlewareCallback = (
    ctx: Context,
    next: () => Promise<any>,
    opt?: MiddlewareInjectOptions
  ) => Promise<any>

  class PreQuest {
    request(path: string | Config, config?: Config): Promise<PQResponse>
    controller(ctx: Context, opt?: MiddlewareInjectOptions): Promise<PQResponse>
    use(cb: MiddlewareCallback): this
    static create(adapter: Adapter, config?: Config): PreQuestInstance
    static defaults: Config
  }

  type PreQuestFn = <Q = any>(path: string | Config, config?: Config) => Promise<PQResponse<Q>>
  type PreQuestBaseInstance = PreQuest & MethodsCallback
  type PreQuestInstance = PreQuestBaseInstance & PreQuestFn

  interface PresetOption {
    path?: string
    method?: UpperMethod
    baseURL?: string
    params?: Common
    data?: Common
  }
}
