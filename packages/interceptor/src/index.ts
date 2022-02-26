import {
  MiddlewareCallback,
  PreQuestError,
  PreQuestRequest,
  PreQuestResponse,
} from '@prequest/types'
import { Interceptor } from './Interceptor'

export default class InterceptorMiddleware {
  request = new Interceptor<PreQuestRequest, PreQuestError>()
  response = new Interceptor<PreQuestResponse, PreQuestError>()

  run: MiddlewareCallback = async (ctx, next) => {
    ctx.request = await this.request.exec(ctx.request)
    await next()
    ctx.response = await this.response.exec(ctx.response)
  }
}
