export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

export type UpperMethod = Uppercase<Method> | ({} & string)

export type MethodsCallback<T, N> = {
  [k in Method]: <Q = N>(path: string, option?: Config<T>) => Promise<Q>
}

export type Config<T> = Partial<T>

export interface PreQuestInjectOption {
  path: string
  method: string
}

export type RequestOption<T> = T & PreQuestInjectOption

export type Adapter<T, N> = (options: RequestOption<T>) => Promise<N>

export interface Context<T, N> {
  request: RequestOption<T>
  response: N
  context: PreQuest<T, N>
}

export type MiddlewareInjectOptions = Record<string, any>

export type MiddlewareCallback<T, N> = (
  ctx: Context<T, N>,
  next: () => Promise<any>,
  opt?: MiddlewareInjectOptions
) => Promise<any>

export class PreQuest<T, N> {
  request(path: string | Config<T>, config?: Config<T>): Promise<N>
  controller(ctx: Context<T, N>, opt?: MiddlewareInjectOptions): Promise<N>
  static create<T, N>(adapter: Adapter<T, N>, config?: Config<T>): PreQuestInstance<T, N>
}

export type PreQuestFn<T, N> = (path: string | T, config?: T) => Promise<N>
export type PreQuestBaseInstance<T, N> = PreQuest<T, N> & MethodsCallback<T, N>
export type PreQuestInstance<T, N> = PreQuestBaseInstance<T, N> & PreQuestFn<T, N>
