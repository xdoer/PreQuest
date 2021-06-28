import { Request } from './types'
import {
  createError,
  createRequestUrl,
  ErrorCode,
  formatRequestBodyAndHeaders,
} from '@prequest/helper'
import { parseResBody } from './helper'

export function adapter<T, N>() {
  return async (options: T): Promise<N> => {
    const finalOptions = (options || {}) as Required<Request>
    const url = createRequestUrl(finalOptions)
    const { data, headers } = formatRequestBodyAndHeaders(finalOptions)
    const { timeout, cancelToken, onDownloadProgress, ...rest } = finalOptions

    const config = { ...rest, body: data, headers } as any

    if (cancelToken) {
      cancelToken.promise.then(cancel => {
        // 环境不支持 abortController，则直接抛异常
        if (!cancelToken.abortController) {
          throw createError(ErrorCode.abort, cancel, config)
        } else {
          cancelToken.abortController.abort()
        }
      })
      config.signal = cancelToken.abortController?.signal
    }

    return fetch(url, config)
      .then(res => {
        // 如果不需要监听下载，则直接返回
        if (!onDownloadProgress) return res

        // 如果不存在响应体，则返回
        if (!res.body) return res

        // 参考: https://segmentfault.com/a/1190000021367378
        const total = Number.parseInt(res.headers.get('content-length') || '')
        const progress = { total: Number.isNaN(total) ? 0 : total, loaded: 0 }
        const [progressStream, returnStream] = res.body.tee()
        const reader = progressStream.getReader()
        const push = () => {
          reader.read().then(({ value, done }) => {
            if (done || !value) return
            progress.loaded += value.length
            onDownloadProgress(progress)
            push()
          })
        }
        push()
        return new Response(returnStream, {
          headers: res.headers,
          status: res.status,
          statusText: res.statusText,
        })
      })
      .then(res => parseResBody(res, options))
  }
}
