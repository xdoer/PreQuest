export type GlobalCache = { [key: string]: Cache }

export type Cache<T = any, Q = any> = {
  called: boolean
  valid: boolean
  loading: boolean
  error: any
  request: T
  response: Q
  stopLoop(): void
  toFetch(opt?: T | ((o: T) => T)): void
}

export interface Config<Q> {
  key?: string
  deps?: any[]
  lazy?: boolean
  loop?: number
  onUpdate?: (prev: Q, value: Q) => Q
}
