import { AdapterConfig } from './types'

export function fetchAdapter(config: Required<AdapterConfig>) {
  const { method, url, headers, timeout, withCredentials, responseType } = config

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open(method, url, true)

    xhr.timeout = timeout
    xhr.withCredentials = withCredentials
    xhr.responseType = responseType

    // set headers
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

    xhr.addEventListener('load', () => {
      if (xhr.readyState === 4) {
        resolve(xhr.responseText)
      }
    })

    xhr.addEventListener('timeout', () => {
      reject(xhr.statusText)
    })

    xhr.addEventListener('error', () => {
      reject(xhr.statusText)
    })

    xhr.send()
  })
}
