type SuccessHandler<T> = (res: T) => T
type ErrorHandler<N> = (err: N) => void

interface Handles<T, N> {
  successHandler: SuccessHandler<T>
  errorHandler?: ErrorHandler<N>
}

export class Interceptor<T, N> {
  protected handles: Handles<T, N>[] = []

  use(successHandler: SuccessHandler<T>, errorHandler: ErrorHandler<N>) {
    this.handles.push({ successHandler, errorHandler })
    return this
  }

  exec(params: T): Promise<T> {
    return this.handles.reduce((t, c) => t.then(c.successHandler, c.errorHandler as any), Promise.resolve(params))
  }
}
