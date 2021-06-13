import { CacheMiddleware } from '@prequest/cache'
import { Request, Response } from '@prequest/miniprogram'

export const cacheMiddleware = new CacheMiddleware<Request, Response>({
  ttl: 5000,
  cacheId(opt) {
    const { path, method } = opt
    return `${method}-${path}`
  },
  cacheControl(opt) {
    return true
  }
})
