import { MiddlewareCallback } from '@prequest/types'
import { Interceptor } from './Interceptor'

export default class InterceptorMiddleware<T, N> {
  request = new Interceptor<T, Error>()
  response = new Interceptor<N, Error>()

  run: MiddlewareCallback<T, N> = async (ctx, next) => {
    ctx.request = await this.request.exec(ctx.request)
    await next()
    ctx.response = await this.response.exec(ctx.response)
  }
}
