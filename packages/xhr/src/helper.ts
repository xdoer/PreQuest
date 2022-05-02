import { PQResponse } from '@prequest/types'

export function createResponse(ctx: XMLHttpRequest, responseType?: string): PQResponse {
  // @ts-ignore
  if (!ctx) return
  const { responseText, status, statusText, response } = ctx || {}

  // 默认为 json 类型
  const needJSONParsing = !responseType || responseType === 'json'

  let data

  try {
    data = !responseType || responseType === 'text' || responseType === 'json' ? responseText : response
    if (needJSONParsing) data = JSON.parse(data)
  } catch (e) {
    console.error('JSON parse fail')
  }

  return {
    data,
    status,
    statusText,
    headers: parseHeaders(ctx),
  }
}

export function parseHeaders(ctx: XMLHttpRequest) {
  const headersStr = ctx.getAllResponseHeaders()
  const headersArr = headersStr
    ?.trim()
    ?.split(/[\r\n]+/)
    .filter(Boolean)

  return headersArr.reduce((headers, line) => {
    const parts = line.split(': ')
    const key = parts.shift()
    const value = parts.join(': ')

    return { ...headers, [key!]: value }
  }, {} as any)
}
