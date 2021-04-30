import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { mergeConfig } from './utils'
import { Config, ReqMethods, ResponseSchema, CommonObject } from './types'

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
      this[method] = (path: string, config: Config) => {
        return this.request(mergeConfig(this.config, config, { path, method }))
      }
    })
  }

  request(config: Config): Promise<ResponseSchema> {
    return Promise.resolve(config)
      .then(res => this.interceptor.request.exec(res))
      .then(res => {
        const { url, adapter, options } = handleReqOptions(res)
        return new Promise((resolve, reject) => {
          // 执行中间件
          return this.exec(res, async (ctx) => {
            try {
              const response = await adapter(url, options)
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

function createReqUrl(baseURL: string, path: string, params: CommonObject = {}) {
  const paramArr = Object.entries(params).map(([key, value]) => `${key}=${encodeURI(value)}`)
  const paramStr = paramArr.join('&')
  return `${baseURL}${path}${paramStr ? '?' + paramStr : ''}`
}

function handleReqOptions(config: Config) {
  const { baseURL, path, params, adapter, body, ...options } = config
  if (!adapter) throw new Error('Not Find Adapter')
  console.log('查看body', body)
  return { url: createReqUrl(baseURL!, path!, params), options, adapter }
}
