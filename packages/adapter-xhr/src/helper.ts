import { Response } from './types'

export function getResponse(ctx: XMLHttpRequest, responseType?: string): Response {
  const { responseText, status, statusText, response } = ctx
  const data = !responseType || responseType === 'text' || responseType === 'json' ? responseText : response
  return {
    data, status, statusText, headers: parseHeaders(ctx)
  }
}

export function parseHeaders(ctx: XMLHttpRequest) {
  const headersStr = ctx.getAllResponseHeaders()
  const headersArr = headersStr?.trim()?.split(/[\r\n]+/).filter(Boolean)

  return headersArr.reduce((headers, line) => {
    const parts = line.split(': ')
    const key = parts.shift()
    const value = parts.join(': ')

    return { ...headers, [key!]: value }
  }, {} as any)
}
