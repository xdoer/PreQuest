import { PreQuest } from "@prequest/core"
import { Request, Response } from './types'
import { getResponse } from './helper'

export default (options: Request) => {
  function adapter(options: Request): Promise<Response> {
    const { method, headers, timeout, data, baseURL, path, withCredentials, responseType } = (options || {}) as Required<Request>
    const url = baseURL + path

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
      Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

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
        resolve(getResponse(xhr, responseType))
      }

      xhr.addEventListener('timeout', () => {
        reject(getResponse(xhr, responseType))
      })

      xhr.addEventListener('error', () => {
        reject(getResponse(xhr, responseType))
      })

      xhr.send(data)
    })
  }

  return PreQuest.createInstance<Request, Response>(adapter, options)
}
