import InterceptorMiddleware from '@prequest/interceptor'
import { Request, Response } from '@prequest/miniprogram'

const interceptorMiddleware = new InterceptorMiddleware<Request, Response>()

export { interceptorMiddleware }
