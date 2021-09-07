export type CommonObject<T = any> = Record<string, T>

export type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

export type UpperMethod = Uppercase<Method> | ({} & string)
