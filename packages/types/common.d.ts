export type CommonObject<T = any> = Record<string, T>

export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

export type UpperMethod = Uppercase<Method> | ({} & string)

type SetRequired<T, N extends keyof T> = {
  [P in keyof T]: Required<Pick<T, N>> & Pick<T, Exclude<keyof T, N>>
}[keyof T]
