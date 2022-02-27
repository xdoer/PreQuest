import { createError, createRequestUrl, ErrorCode } from '@prequest/helper'
import { Config, PQRequest, PQResponse } from '@prequest/types'

const ctx: any = globalThis

export function adapter() {
  return (opt: Config): Promise<PQResponse> => {
    let jsonpId = 1
    return new Promise((resolve, reject) => {
      const finalOption = (opt || {}) as PQRequest
      const { callbackParamName, cancelToken, params } = finalOption

      let isAbort = false
      let script: any = document.createElement('script')
      script.async = true

      const jsonp = 'JsonpCallback' + jsonpId++
      const oldJsonp = ctx[jsonp]

      ctx[jsonp] = function(responseData: PQResponse) {
        if (isAbort) return
        ctx[jsonp] = oldJsonp

        resolve({ statusCode: 200, data: responseData } as any)
      }

      script.src = createRequestUrl({
        ...finalOption,
        params: { ...params, [callbackParamName || 'callback']: jsonp },
      })

      script.onload = script.onreadystatechange = function() {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          remove()
        }
      }

      script.onerror = function() {
        remove()
        reject(createError(ErrorCode.common, 'network error', opt))
      }

      function remove() {
        if (script) {
          script.onload = script.onreadystatechange = script.onerror = null

          if (script.parentNode) {
            script.parentNode.removeChild(script)
          }

          script = null
        }
      }

      if (cancelToken) {
        cancelToken.promise.then(function(cancel) {
          if (!script) return

          isAbort = true

          reject(cancel)
        })
      }

      document.head.appendChild(script)
    })
  }
}
