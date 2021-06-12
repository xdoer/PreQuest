import './config'
import { wxDownload } from './download'
import { wxUpload } from './upload'
import { prequest } from './request'
import { lockMiddleware, lock } from './token'

wxDownload.use(lockMiddleware)
wxUpload.use(lockMiddleware)
prequest.use(lockMiddleware)

export {
  wxDownload,
  wxUpload,
  prequest,
  lock
}
