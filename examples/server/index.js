import express from 'express'
import { router as apiRouter} from './router/api.js'
import { router as downloadRouter } from './router/download.js'
import { router as uploadRouter } from './router/upload.js'

const app = express()

app
.use(apiRouter)
.use(downloadRouter)
.use(uploadRouter)

app.listen(3000, function () {
  console.log('服务已开启')
})
