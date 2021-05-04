import { PreQuest } from '@prequest/core'
import { createRequestUrl } from '@prequest/helper'
import { Request, Response } from './types'

export * from './types'

function create(request: any, instanceOpt?: Request) {
  return PreQuest.createInstance<Request, Response>(adapter(request), instanceOpt)
}

export { create }

export default create

function adapter(request: any) {
  return (opt: Request): Promise<Response> => {
    const finalOption = (opt || {}) as Required<Request>
    const url = createRequestUrl(finalOption)
    const { getRequestInstance = () => { } } = finalOption

    return new Promise((resolve, reject) => {
      getRequestInstance(request({
        ...finalOption,
        url,
        success: resolve,
        fail: reject
      }))
    })
  }
}
