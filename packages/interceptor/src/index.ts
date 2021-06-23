import { MiddlewareCallback } from '@prequest/types'
import { Interceptor } from './Interceptor'

export * from './Interceptor'

export default class InterceptorMiddleware<T, N, E = Error> {
  request = new Interceptor<T, E>()
  response = new Interceptor<N, E>()

  run: MiddlewareCallback<T, N> = async (ctx, next) => {
    ctx.request = await this.request.exec(ctx.request)
    await next()
    ctx.response = await this.response.exec(ctx.response)
  }
}
