import { Middleware } from './Middleware'
import { METHODS } from './constant'
import { merge } from '@prequest/utils'
import { Context, Config, MethodsCallback, RequestOption, Adapter } from '@prequest/types'

export class PreQuestBase<T, N> extends Middleware<T, N> {
  constructor(private adapter: Adapter<T, N>, private config?: Config<T>) {
    super()
    this.config = merge(PreQuestBase.defaults, this.config)
    this.mount()
  }

  private mount() {
    const preQuest = <MethodsCallback<T, N>>(this as unknown)

    METHODS.forEach(method => {
      preQuest[method] = (path: string, config?: Config<T>) => {
        const request = <RequestOption<T>>merge(this.config, { path, method } as any, config!)
        const response = <N>{}
        return this.controller({ request, response })
      }
    })
  }

  request(path: string | Config<T>, config?: Config<T>) {
    const opt = typeof path === 'string' ? merge({ path }, config) : path
    const request = <RequestOption<T>>merge(this.config, opt)
    const response = <N>{}
    return this.controller({ request, response })
  }

  private controller(ctx: Context<T, N>): Promise<N> {
    return this.exec(ctx, async ctx => {
      const response = await this.adapter(ctx.request)
      ctx.response = response
    }).then(() => ctx.response)
  }

  static defaults: any = {}

  static createInstance<T, N>(adapter: Adapter<T, N>, config?: Config<T>) {
    return new PreQuestBase<T, N>(adapter, config) as PreQuestBaseInstance<T, N>
  }
}

export type PreQuestBaseInstance<T, N> = PreQuestBase<T, N> & MethodsCallback<T, N>
