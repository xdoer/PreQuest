import { PreQuest } from '../../core'
import { Request, Response } from './types'

export const defaultOption: Request = { method: 'get', headers: { Accept: 'application/json' }, responseType: 'text' }

export function xhrAdapter(options: Request) {
  return PreQuest.createInstance<Request, Response, Error>({
    ...defaultOption,
    ...options,
    adapter(options) {
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
  })
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
