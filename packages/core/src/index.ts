import {
  Adapter,
  Config,
  MethodsCallback,
  PQRequest,
  PQResponse,
  PreQuestInstance,
  Context,
  MiddlewareInjectOptions,
} from '@prequest/types'
import { merge } from '@prequest/utils'
import { Middleware } from './Middleware'
import { METHODS } from './constant'

export class PreQuest extends Middleware {
  constructor(private adapter: Adapter, private config?: Config) {
    super()
    this.mount()
  }

  private mount() {
    const preQuest = <MethodsCallback>(this as unknown)

    METHODS.forEach(method => {
      preQuest[method] = (path: string, config?: Config) => {
        const request = <PQRequest>(
          merge(
            PreQuest.defaults,
            this.config,
            { path, method: method.toUpperCase() } as any,
            config!
          )
        )
        const response = <PQResponse>{}
        return this.controller({ request, response, context: this })
      }
    })
  }

  request<Q>(path: string | Config, config?: Config): Promise<PQResponse<Q>> {
    const request = <PQRequest>(
      merge(PreQuest.defaults, this.config, typeof path === 'string' ? { path, ...config } : path)
    )
    const response = <PQResponse>{}
    return this.controller<Q>({ request, response, context: this })
  }

  async controller<Q>(ctx: Context, opt: MiddlewareInjectOptions = {}): Promise<PQResponse<Q>> {
    await this.exec(
      ctx,
      async ctx => {
        ctx.response = await this.adapter(ctx.request)
      },
      opt
    )
    return ctx.response as any
  }

  static defaults: Config = {}

  static create(adapter: Adapter, config?: Config): PreQuestInstance {
    const instance = new PreQuest(adapter, config)

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
