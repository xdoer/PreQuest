type SuccessHandler = (res: any) => any
type ErrorHandler = (err: any) => any

interface Handles {
  successHandler: SuccessHandler
  errorHandler?: ErrorHandler
}

export class Interceptor {
  handles: Handles[] = []

  use(successHandler: SuccessHandler, errorHandler: ErrorHandler) {
    this.handles.push({ successHandler, errorHandler })
    return this
  }

  exec(params: any) {
    return this.handles.reduce((t, c) => t.then(c.successHandler, c.errorHandler), Promise.resolve(params))
  }
}
