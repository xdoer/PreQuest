import { merge } from '@prequest/utils'
import {
  Context,
  Config,
  MethodsCallback,
  RequestOption,
  Adapter,
  MiddlewareInjectOptions,
  CommonObject,
} from '@prequest/types'
import { Middleware } from './Middleware'
import { METHODS } from './constant'

export class PreQuest<T, N> extends Middleware<T, N> {
  constructor(private adapter: Adapter<T, N>, private config?: Config<T>) {
    super()
    this.mount()
  }

  private mount() {
    const preQuest = <MethodsCallback<T, N>>(this as unknown)

    // TODO: dynamic injection response data type
    METHODS.forEach(method => {
      preQuest[method] = (path: string, config?: Config<T>) => {
        const request = <RequestOption<T>>(
          merge(
            PreQuest.defaults,
            this.config,
            { path, method: method.toUpperCase() } as any,
            config!
          )
        )
        const response = <N>{}
        return this.controller({ request, response, context: this })
      }
    })
  }

  request<Q = N>(path: string | Config<T>, config?: Config<T>): Promise<Q> {
    const request = <RequestOption<T>>(
      merge(PreQuest.defaults, this.config, typeof path === 'string' ? { path, ...config } : path)
    )
    const response = <N>{}
    return this.controller<Q>({ request, response, context: this })
  }

  async controller<Q = N>(ctx: Context<T, N>, opt: MiddlewareInjectOptions = {}): Promise<Q> {
    await this.exec(
      ctx,
      async ctx => {
        ctx.response = await this.adapter(ctx.request)
      },
      opt
    )
    return ctx.response as any
  }

  static defaults: CommonObject = {}

  static create<T, N>(adapter: Adapter<T, N>, config?: Config<T>): PreQuestInstance<T, N> {
    const instance = new PreQuest<T, N>(adapter, config) as PreQuestBaseInstance<T, N>

    return new Proxy(adapter as any, {
      get(_, name) {
        return Reflect.get(instance, name) || Reflect.get(adapter, name)
      },
      apply(_, __, args) {
        return Reflect.apply(instance.request, instance, args)
      },
    })
  }
}

export type PreQuestFn<T, N> = <Q = N>(path: string | T, config?: T) => Promise<Q>

export type PreQuestBaseInstance<T, N> = PreQuest<T, N> & MethodsCallback<T, N>

export type PreQuestInstance<T, N> = PreQuestBaseInstance<T, N> & PreQuestFn<T, N>
