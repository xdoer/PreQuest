import { Request, Response, PreQuest } from '@prequest/xhr'
import { interceptor } from './interceptor'

PreQuest.use<Request, Response>(interceptor.run)

PreQuest.use<Request, Response>(async (ctx, next) => {
  console.log('全局中间件-请求', ctx.request)
  await next()
  console.log('全局中间件-响应', ctx.response)
})
