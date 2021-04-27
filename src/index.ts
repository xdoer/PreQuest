import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { mergeConfig } from './utils'
import { Config, ReqMethods } from './types'

const reqMethods: ReqMethods[] = ['get', 'post']

export class Axis extends Middleware {
  config: Config = {}

  get: any
  post: any

  interceptor = new Interceptor()

  constructor(config?: Config) {
    super()
    this.config = mergeConfig(this.config, config || {})
    this.init()
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
        return this.getAdapter(adapterConfig)
      }
    })
  }

  getAdapter(config: any) {
    return this.exec(config, async (ctx) => {
      ctx.response = await this.config.adapter(config)
    })
  }
}
