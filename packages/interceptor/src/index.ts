import { MiddlewareCallback, PQError, PQRequest, PQResponse } from '@prequest/types'
import { Interceptor } from './Interceptor'

export default class InterceptorMiddleware {
  request = new Interceptor<PQRequest, PQError>()
  response = new Interceptor<PQResponse, PQError>()

  run: MiddlewareCallback = async (ctx, next) => {
    ctx.request = await this.request.exec(ctx.request)
    await next()
    ctx.response = await this.response.exec(ctx.response)
  }
}
