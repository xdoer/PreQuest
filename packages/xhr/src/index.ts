import { PreQuest } from "@prequest/core"
import { baseOption, createRequestUrl, formatRequestBodyAndHeaders, merge } from '@prequest/helper'
import { Request, Response } from './types'
import { createError, createResponse } from './helper'

export * from './types'
export * from '@prequest/core'

const prequest = (options: Request) => {
  return PreQuest.createInstance<Request, Response>(adapter, merge(baseOption, options))
}

export { prequest }

export default prequest

function adapter(options: Request): Promise<Response> {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const { timeout, withCredentials, responseType, method } = finalOptions

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.timeout = timeout
    xhr.withCredentials = withCredentials

    /**
     * https://github.com/axios/axios/blob/master/lib/adapters/xhr.js
     * https://stackoverflow.com/questions/36265554/how-to-check-ajax-response-string-when-type-is-set-to-json
     */
    if (responseType !== 'json') {
      xhr.responseType = responseType
    }

    // set headers
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, <string>value))

    if (xhr.onloadend) {
      xhr.addEventListener('loadend', () => {
        if (xhr.readyState === 4) {
          onloadend()
        }
      })
    } else {
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          setTimeout(onloadend)
        }
      })
    }

    function onloadend() {
      resolve(createResponse(xhr, responseType))
    }

    xhr.addEventListener('timeout', () => {
      reject(createError('请求超时'))
    })

    xhr.addEventListener('error', () => {
      reject(createError('请求错误'))
    })

    xhr.send(data)
  })
}