import { elementType } from '@prequest/utils'
import { Proxy } from './types'

function isObject(val: any) {
  return val !== null && typeof val === 'object'
}

function isFunction(val: any) {
  return elementType(val) === 'function'
}

export function isStream(val: any) {
  return isObject(val) && isFunction(val.pipe)
}

export function getRequestBody(data: any) {
  if (isStream(data)) return data

  if (elementType(data) === 'arraybuffer') return Buffer.from(new Uint8Array(data))

  if (elementType(data) === 'string') return Buffer.from(data, 'utf-8')

  return null
}

export function stripBOM(content: string) {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1)
  }
  return content
}

export function setProxy(options: any, proxy: Proxy, location: string) {
  options.hostname = proxy.host
  options.host = proxy.host
  options.port = proxy.port
  options.path = location

  if (proxy.auth) {
    const base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString(
      'base64'
    )
    options.headers['Proxy-Authorization'] = 'Basic ' + base64
  }

  options.beforeRedirect = (redirection: any) => {
    redirection.headers.host = redirection.host
    setProxy(redirection, proxy, redirection.href)
  }
}

export const isHttpsReg = /^https:?/
