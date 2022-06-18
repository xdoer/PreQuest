import { createError, createRequestUrl, enhanceError, ErrorCode } from '@prequest/helper'
import { Config, PQRequest, PQResponse } from '@prequest/types'
import { createResponse } from './helper'

export function adapter(options: Config): Promise<PQResponse> {
  const finalOptions = (options || {}) as PQRequest
  const url = createRequestUrl(finalOptions)
  const {
    data,
    headers = {},
    timeout,
    withCredentials,
    responseType,
    method,
    getNativeRequestInstance,
    cancelToken,
    onDownloadProgress,
    onUploadProgress,
  } = finalOptions

  return new Promise((resolve, reject) => {
    let xhr: any = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.timeout = timeout
    xhr.withCredentials = withCredentials

    /**
     * https://github.com/axios/axios/blob/master/lib/adapters/xhr.js
     * https://stackoverflow.com/questions/36265554/how-to-check-ajax-response-string-when-type-is-set-to-json
     */
    if (responseType && responseType !== 'json') {
      xhr.responseType = responseType
    }

    // set headers
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, <string>value))

    if (xhr.onloadend) {
      xhr.addEventListener('loadend', onloadend)
    } else {
      xhr.addEventListener('readystatechange', () => {
        if (xhr?.readyState !== 4) return
        if (xhr.status === 0 && !(xhr.responseURL && xhr.responseURL.indexOf('file:') === 0)) {
          return
        }
        setTimeout(onloadend)
      })
    }

    function onloadend() {
      resolve(createResponse(xhr, responseType) as any)
      xhr = null
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

    getNativeRequestInstance?.(xhr)

    xhr.send(data)
  })
}
