import { adapter } from './xhr-adapter'

type ReqMethods = 'get' | 'post'
const reqMethods: ReqMethods[] = ['get', 'post']

interface Config {
  baseURL?: string
}

export class Axis {
  config: Config = {}

  get: any
  post: any

  constructor(config?: any) {
    this.config = Object.assign({}, this.config, config)
    this.init()
  }

  init() {
    reqMethods.forEach(method => {
      this[method] = async (url: string, config: Config) => {
        const axisConfig = Object.assign({}, this.config, config)
        const adapterConfig = {
          ...axisConfig,
          url: axisConfig.baseURL + url,
          method,
        }
        return this.getAdapter(adapterConfig)
      }
    })
  }

  getAdapter(config: any) {
    // TODO: 执行中间件
    return adapter(config)
  }
}
