import { PreQuest } from '@prequest/core'
import { createRequestUrl } from '@prequest/helper'
import { Request, Response, RequestCore } from './types'

export * from './types'
export * from '@prequest/core'

function createPreQuest(request: RequestCore, instanceOpt?: Request) {
  return PreQuest.createInstance<Request, Response>(adapter(request), instanceOpt)
}

export { createPreQuest }

export default createPreQuest

function adapter(request: RequestCore) {
  return (opt: Request): Promise<Response> => {
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
