import { Config, PQResponse, PQRequest } from '@prequest/types'
import {
  createError,
  createRequestUrl,
  ErrorCode,
  formatRequestBodyAndHeaders,
} from '@prequest/helper'
import { parseResBody } from './helper'

export async function adapter(options: Config): Promise<PQResponse> {
  const finalOptions = (options || {}) as PQRequest
  const url = createRequestUrl(finalOptions!)
  const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
  const { cancelToken, onDownloadProgress, ...rest } = finalOptions!

  const config = { ...rest, body: data, headers } as any

  async function main() {
    const fetchResponse = await fetch(url, config)
    if (!onDownloadProgress || !fetchResponse.body) return parseResBody(fetchResponse, options)

    // 参考: https://segmentfault.com/a/1190000021367378
    const total = Number.parseInt(fetchResponse.headers.get('content-length') || '')
    const progress = { total: Number.isNaN(total) ? 0 : total, loaded: 0 }
    const [progressStream, returnStream] = fetchResponse.body.tee()
    const reader = progressStream.getReader()
    const push = async () => {
      const { value, done } = await reader.read()
      if (done || !value) return
      progress.loaded += value.length
      onDownloadProgress(progress)
      await push()
    }
    await push()

    const newResponse = await new Response(returnStream, {
      headers: fetchResponse.headers,
      status: fetchResponse.status,
      statusText: fetchResponse.statusText,
    })

    return parseResBody(newResponse, options)
  }

  return Promise.race([
    main(),
    cancelToken?.promise
      .then(cancel => {
        throw createError(ErrorCode.abort, cancel, config)
      })
      .catch(e => {
        throw e
      }),
  ])
}
