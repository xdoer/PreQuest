import { Middleware } from './Middleware'
import { METHODS } from './constant'
import { merge } from './helper'
import { Context, Config, MethodsCallback, RequestOption, Adapter } from '@prequest/types'

export class PreQuest<T, N> extends Middleware<T, N> {

  constructor(private adapter: Adapter<T, N>, private config?: Config<T>) {
    super()
    this.mountMethods()
  }

  private mountMethods() {
    const preQuest = <MethodsCallback<T, N>>(this as unknown)
    METHODS.forEach((method) => {
      preQuest[method] = (path: string, config?: Config<T>) => {
        const request = merge(this.config, config!, { path, method } as any)
        return this.controller({ request: request as RequestOption<T>, response: {} as N })
      }
    })
  }

  private controller(ctx: Context<T, N>): Promise<N> {
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
  }

  static createInstance<T, N>(adapter: Adapter<T, N>, config?: Config<T>) {
    return new PreQuest<T, N>(adapter, config) as PreQuest<T, N> & MethodsCallback<T, N>
  }
}
