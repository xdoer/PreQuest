import { AdapterRequest, Response } from '../types'

interface AdapterOption {
  withCredentials?: any
  responseType?: any
}

export function xmlAdapter(opt: AdapterOption) {
  const { withCredentials, responseType } = opt
  return function xmlAdapter(url: string, config: AdapterRequest): Promise<Response> {
    const { method, headers, timeout, data, injectAdapterInstance } = config || {}

    return Promise
      .resolve(injectAdapterInstance?.(url, config) || new XMLHttpRequest())
      .then(xhr => {

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

        return new Promise((resolve, reject) => {
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
      })
  }
}

function getResponse(ctx: XMLHttpRequest, responseType?: string): Response {
  const { responseText, status, statusText, response } = ctx
  const data = !responseType || responseType === 'text' || responseType === 'json' ? responseText : response
  return {
    data, status, statusText, headers: parseHeaders(ctx)
  }
}

function parseHeaders(ctx: XMLHttpRequest) {
  const headersStr = ctx.getAllResponseHeaders()
  const headersArr = headersStr?.trim()?.split(/[\r\n]+/).filter(Boolean)

  return headersArr.reduce((headers, line) => {
    const parts = line.split(': ')
    const key = parts.shift()
    const value = parts.join(': ')

    return { ...headers, [key!]: value }
  }, {} as any)
}
