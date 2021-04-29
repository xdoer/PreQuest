import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { mergeConfig } from './utils'
import { Config, ReqMethods, RequestOption, ResponseSchema } from './types'

const reqMethods: ReqMethods[] = ['get', 'post']

export class PreQuest extends Middleware {
  config: Config = {}

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
        const axisConfig = mergeConfig(this.config, config)
        const adapterConfig = {
          ...axisConfig,
          url: axisConfig.baseURL + url,
          method: method.toUpperCase(),
        }
        return this.request(adapterConfig)
      }
    })
  }

  request(options: RequestOption): Promise<ResponseSchema> {
    return this.interceptor.request
      .exec(options)
      .then(res => this.exec(res, async (ctx) => {
        ctx.response = await this.config.adapter(res)
      }))
      .then(res => this.interceptor.response.exec(res))
      .catch(e => {
        console.log(e)
      })
  }
}
