import './config'
import { wxDownload } from './download'
import { wxUpload } from './upload'
import { prequest } from './request'
import { lockMiddleware, lock } from './token'
import { errorRetryMiddleware } from './error-retry'
import { parseResponse } from './mddleware'
import { cacheMiddleware } from './cache'
import { source as cancelSource } from './cancel-token'

// 这里要注意注册中间件的顺序
prequest
  .use(cacheMiddleware.run)
  .use(errorRetryMiddleware.run)
  .use(lockMiddleware)
  .use(parseResponse)

wxDownload.use(lockMiddleware)
wxUpload.use(lockMiddleware)

export {
  wxDownload,
  wxUpload,
  prequest,
  cancelSource,
  lock
}
