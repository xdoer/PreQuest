import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { mergeConfig } from './utils'
import { Config, ReqMethods, RequestOption, ResponseSchema, Adapter } from './types'

const reqMethods: ReqMethods[] = ['get', 'post']

export class PreQuest extends Middleware {
  config: Config = {
    method: 'GET'
  }

  get: any
  post: any

  constructor(config?: Config) {
    super()
    this.config = mergeConfig(this.config, config || {})
    this.init()
  }

  interceptor = {
    request: new Interceptor(),
    response: new Interceptor()
  }

  init() {
    reqMethods.forEach(method => {
      this[method] = async (url: string, config: Config) => {
        const { adapter, method, baseURL, ...options } = mergeConfig(this.config, config)
        if (!adapter) throw new Error('Not Find Adapter')
        const reqURL = baseURL + url
        const adapterOptions: RequestOption = { ...options, method: method?.toUpperCase() || 'GET' }
        return this.request(reqURL, adapterOptions, adapter)
      }
    })
  }

  request(url: string, options: RequestOption, adapter: Adapter): Promise<ResponseSchema> {
    return Promise.resolve(options)
      .then(res => this.interceptor.request.exec(res))
      .then(res => {
        return new Promise((resolve, reject) => {
          return this.exec(res, async (ctx) => {
            try {
              const response = await adapter(url, res)
              ctx.response = response
              resolve(response)
            } catch (e) {
              reject(e)
            }
          })
        })
      })
      .then(res => this.interceptor.response.exec(res))
      .catch(e => console.log('捕获报错', e))
  }
}
