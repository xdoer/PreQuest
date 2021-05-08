import { PreQuestBase } from '@prequest/core'
import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export * from './types'
export * from '@prequest/core'

function create<T, N>(request: RequestCore, instanceOpt?: Request & T) {
  return PreQuestBase.createInstance<Request & T, Response & N>(adapter<T, N>(request), instanceOpt)
}

export { create }

function adapter<T, N>(request: RequestCore) {
  return (opt: Request & T): Promise<Response & N> => {
    const finalOption = (opt || {}) as Required<Request>
    const url = createRequestUrl(finalOption)
    const { getRequestInstance = () => {}, ...rest } = finalOption

    return new Promise((resolve, reject) => {
      getRequestInstance(
        request({
          url,
          ...rest,
          success: resolve,
          fail: reject,
        })
      )
    })
  }
}
