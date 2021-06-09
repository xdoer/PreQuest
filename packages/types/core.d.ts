export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

export type MethodsCallback<T, N> = {
  [k in Method]: (path: string, option?: Config<T>) => Promise<N>
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
  controller(ctx: Context<T, N>, opt?: MiddlewareInjectOptions): Promise<N>
}
