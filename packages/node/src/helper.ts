import { elementType } from '@prequest/utils'

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
