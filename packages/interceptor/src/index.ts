import { MiddlewareCallback } from '@prequest/types'
import { Interceptor } from './Interceptor'

export * from './Interceptor'

export class InterceptorMiddleware<T, N, E> {
  request = new Interceptor<T, E>()
  response = new Interceptor<N, E>()

  run: MiddlewareCallback<T, N> = async (ctx, next) => {
    await this.request.exec(ctx.request)
    await next()
    await this.response.exec(ctx.response)
  }
}
