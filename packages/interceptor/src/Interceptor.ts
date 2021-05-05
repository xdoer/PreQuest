type SuccessHandler<T> = (res: T) => T
type ErrorHandler<N> = (err: N) => any

interface Handles<T, N> {
  successHandler: SuccessHandler<T>
  errorHandler?: ErrorHandler<N>
}

export class Interceptor<T, N> {
  private handles: Handles<T, N>[] = []

  use(successHandler: SuccessHandler<T>, errorHandler?: ErrorHandler<N>) {
    this.handles.push({ successHandler, errorHandler })
    return this
  }

  exec(params: T): Promise<void | T> {
    return this.handles
      .reduce(
        (t, c, idx) => t.then(c.successHandler, this.handles[idx - 1]?.errorHandler),
        Promise.resolve(params)
      )
      .catch(this.handles[this.handles.length - 1].errorHandler)
  }
}
