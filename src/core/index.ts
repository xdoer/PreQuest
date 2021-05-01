import { Middleware } from './Middleware'
import { Interceptor } from './Interceptor'
import { METHODS } from './constant'
import { mergeConfig } from './helper'
import { Context, Config, Methods, RequestOption, Adapter } from './types'

export class PreQuest<T, N, E> extends Middleware<T, N> {

  constructor(private adapter: Adapter<T, N>, private config?: Config<T>) {
    super()
    this.mountMethods()
  }

  interceptor = {
    request: new Interceptor<T, E>(),
    response: new Interceptor<N, E>()
  }

  protected mountMethods() {
    const preQuest = <Methods<T, N>>(this as unknown)
    METHODS.forEach((method) => {
      preQuest[method] = (path: string, config?: Config<T>) => {
        const request = mergeConfig(this.config, config!, { path, method } as any)
        return this.controller({ request: request as RequestOption<T>, response: {} as N })
      }
    })
  }

  protected controller(ctx: Context<T, N>): Promise<N> {
    return Promise.resolve()
      .then(() => this.interceptor.request.exec(ctx.request))
      .then(() => {
        return new Promise((resolve, reject) => {
          return this.exec(ctx, async (ctx) => {
            try {
              const response = await this.adapter(ctx.request)
              ctx.response = response
              resolve(response)
            } catch (e) {
              reject(e)
            }
          })
        })
      })
      .then(() => this.interceptor.response.exec(ctx.response))
  }

  static createInstance<T, N, E>(adapter: Adapter<T, N>, config?: Config<T>) {
    return new PreQuest<T, N, E>(adapter, config) as PreQuest<T, N, E> & Methods<T, N>
  }
}
