import { Config } from '@prequest/types'

interface PQError {
  code: ErrorCode
  config: Config
}

export class PreQuestError extends Error {
  code?: ErrorCode
  config?: Config

  constructor(private opt?: Partial<PQError>) {
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

export function createError(code: ErrorCode, message: string, opt: Config) {
  const error = new Error(message)
  return enhanceError(error, code, opt)
}

export function enhanceError(error: PreQuestError, code: ErrorCode, opt: Config) {
  error.code = code
  error.config = opt

  return error
}
