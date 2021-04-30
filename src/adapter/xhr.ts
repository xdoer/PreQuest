import { RequestOption, ResponseSchema } from '../types'

export function xmlAdapter(url: string, config: Required<RequestOption>): Promise<ResponseSchema> {
  const { method, headers, timeout, withCredentials, responseType } = config

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open(method, url, true)

    xhr.timeout = timeout
    xhr.withCredentials = withCredentials
    xhr.responseType = responseType

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
      resolve(getResponse(xhr))
    }

    xhr.addEventListener('timeout', (e) => {
      console.log('触发超时', e, xhr)
      reject(xhr.statusText)
    })

    xhr.addEventListener('error', () => {
      reject(xhr.statusText)
    })

    xhr.send()
  })
}

function getResponse(ctx: XMLHttpRequest): ResponseSchema {
  const { responseText, status, statusText } = ctx
  return {
    data: responseText, status, statusText, headers: parseHeaders(ctx)
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
