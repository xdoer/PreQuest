import { Middleware } from './Middleware'
import { METHODS } from './constant'
import { merge } from '@prequest/utils'
import { Context, Config, MethodsCallback, RequestOption, Adapter } from '@prequest/types'

export class PreQuest<T, N> extends Middleware<T, N> {

  constructor(private adapter: Adapter<T, N>, private config?: Config<T>) {
    super()
    this.config = merge(PreQuest.defaults, this.config)
    this.mount()
  }

  private mount() {
    const preQuest = <MethodsCallback<T, N>>(this as unknown)

    METHODS.forEach((method) => {
      preQuest[method] = (path: string, config?: Config<T>) => {
        const request = <RequestOption<T>>merge({ path, method } as any, this.config, config!)
        const response = <N>{}
        return this.controller({ request, response })
      }
    })
  }

  request(config: Config<T> & { path: string }) {
    const request = <RequestOption<T>>merge(this.config, config!)
    const response = <N>{}
    return this.controller({ request, response })
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

  static defaults: any = {}

  static createInstance<T, N>(adapter: Adapter<T, N>, config?: Config<T>) {
    return new PreQuest<T, N>(adapter, config) as PreQuest<T, N> & MethodsCallback<T, N>
  }
}
