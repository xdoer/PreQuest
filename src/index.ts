import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { METHODS, defaultConfig } from './constant'
import { handleReqOptions, mergeConfig } from './helper'
import { Response, Context, Config, Methods } from './types'

class _PreQuest extends Middleware {
  config: Config

  constructor(config?: Config) {
    super()
    this.config = mergeConfig(defaultConfig, config!)
    this.mountMethods()
  }

  interceptor = {
    request: new Interceptor(),
    response: new Interceptor()
  }

  mountMethods() {
    const preQuest = <Methods>(this as unknown)
    METHODS.forEach(method => {
      preQuest[method] = (path: string, config?: Config) => {
        const { adapter, ...request } = mergeConfig(this.config, config!, { path, method }) || {}
        if (!adapter) throw new Error('Not Find Adapter')
        return this.request({ adapter, request, response: {} })
      }
    })
  }

  request(ctx: Context): Promise<Response> {
    return Promise.resolve()
      .then(() => this.interceptor.request.exec(ctx.request))
      .then(() => {
        return new Promise((resolve, reject) => {
          return this.exec(ctx, async (ctx) => {
            try {
              const { url, options } = handleReqOptions(ctx.request)
              const response = await ctx.adapter(url, options)
              ctx.response = response
              resolve(response)
            } catch (e) {
              reject(e)
            }
          })
        })
      })
      .then(() => this.interceptor.response.exec(ctx.response))
      .catch(e => console.log('捕获报错', e))
  }
}

export const PreQuest = _PreQuest as _PreQuest & { new(config?: Config): _PreQuest & Methods }
