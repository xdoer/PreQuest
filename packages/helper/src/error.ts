interface PQError<T> {
  code: ErrorCode
  config: T
}

export class PreQuestError<T> extends Error {
  code?: ErrorCode
  config?: T

  constructor(private opt?: Partial<PQError<T>>) {
    super()
    const { code, config } = this.opt || {}
    this.code = code
    this.config = config
  }
}

export enum ErrorCode {
  timeout = 'timeout',
  abort = 'abort',
  common = 'common',
}

export function createError<T>(code: ErrorCode, message: string, opt: T) {
  const error = new Error(message)
  return enhanceError(error, code, opt)
}

export function enhanceError<T>(error: PreQuestError<T>, code: ErrorCode, opt: T) {
  error.code = code
  error.config = opt

  return error
}
