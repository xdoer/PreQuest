import {
  createError,
  createRequestUrl,
  enhanceError,
  ErrorCode,
  formatRequestBodyAndHeaders,
} from '@prequest/helper'
import { Request, Response } from './types'
import { createResponse } from './helper'

export function adapter(options: Request): Promise<Response> {
  const finalOptions = (options || {}) as Required<Request>
  const url = createRequestUrl(finalOptions)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const {
    timeout,
    withCredentials,
    responseType,
    method,
    getNativeRequestInstance,
    cancelToken,
    onDownloadProgress,
    onUploadProgress,
  } = finalOptions

  let resolvePromise: any
  getNativeRequestInstance?.(new Promise(resolve => (resolvePromise = resolve)))

  return new Promise((resolve, reject) => {
    let xhr: any = new XMLHttpRequest()
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

    xhr.addEventListener('timeout', (e: any) => reject(enhanceError(e, ErrorCode.timeout, options)))

    xhr.addEventListener('error', (e: any) => reject(enhanceError(e, ErrorCode.common, options)))

    if (cancelToken) {
      cancelToken.promise.then(cancel => {
        if (!xhr) return

        xhr.abort()
        reject(createError(ErrorCode.abort, cancel, options))
        xhr = null
      })
    }

    xhr.addEventListener('progress', onDownloadProgress)

    xhr.upload?.addEventListener('progress', onUploadProgress)

    xhr.addEventListener('abort', (e: any) => reject(enhanceError(e, ErrorCode.abort, options)))

    resolvePromise?.(xhr)

    xhr.send(data)
  })
}
