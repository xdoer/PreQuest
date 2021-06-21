interface PQError<T, N> {
  message: string
  code: ErrorCode
  request: T
  response: N
}

export class PreQuestError<T, N> extends Error {
  type?: string
  code?: ErrorCode
  request?: T
  response?: N

  constructor(private opt?: Partial<PQError<T, N>>) {
    super(opt?.message)

    const { code, request, response } = this.opt || {}
    this.code = code
    this.request = request
    this.response = response
  }

  isPreQuestError = true
}

export enum ErrorCode {
  timeout = 'timeout',
  abort = 'abort',
  common = 'common',
}
