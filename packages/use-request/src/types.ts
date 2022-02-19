export type GlobalCache = { [key: string]: Cache }

interface ToFetchConfig<Q> {
  onUpdate?: (prev: Q, value: Q) => Q
}

export type Cache<T = any, Q = any> = {
  valid: boolean
  loading: boolean
  error: any
  request: T
  response: Q
  stopLoop(): void
  toFetch(opt?: T | ((o: T) => T), config?: ToFetchConfig<Q>): void
}

export interface Config<Q> {
  key?: string
  deps?: any[]
  lazy?: boolean
  loop?: number
  onUpdate?: (prev: Q, value: Q) => Q
}
