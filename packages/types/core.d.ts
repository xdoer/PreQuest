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
}

export type MiddlewareCallback<T, N> = (
  ctx: Context<T, N>,
  next: () => Promise<any>
) => Promise<any>
