interface Adapter {
  method: string
  url: string
  timeout: number
  withCredentials: boolean
  headers: Record<string, string>
  responseType: XMLHttpRequestResponseType
}

export function adapter(config: Adapter) {
  const { method, url, headers, timeout, withCredentials, responseType } = config

  const xhr = new XMLHttpRequest()

  xhr.open(method, url, true)

  xhr.timeout = timeout
  xhr.withCredentials = withCredentials
  xhr.responseType = responseType

  // set headers
  Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

  xhr.addEventListener('load', (e) => {
    if (xhr.readyState === 4) {
      console.log('请求成功', e)
    }
  })

  xhr.addEventListener('timeout', (e) => {
    console.log('请求成功', e)
  })

  xhr.addEventListener('error', (e) => {
    console.log('请求失败', e)
  })

  xhr.send()
}
