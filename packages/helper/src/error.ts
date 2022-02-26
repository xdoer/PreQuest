import { PreQuestRequest } from '@prequest/types'

interface PQError {
  code: ErrorCode
  config: PreQuestRequest
}

export class PreQuestError extends Error {
  code?: ErrorCode
  config?: PreQuestRequest

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

export function createError(code: ErrorCode, message: string, opt: PreQuestRequest) {
  const error = new Error(message)
  return enhanceError(error, code, opt)
}

export function enhanceError(error: PreQuestError, code: ErrorCode, opt: PreQuestRequest) {
  error.code = code
  error.config = opt

  return error
}
