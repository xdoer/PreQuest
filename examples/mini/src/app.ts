import "@tarojs/async-await"
import { useEffect } from "react"
import { create } from '@prequest/miniprogram'
import { isCancel, CancelToken } from '@prequest/cancel-token'
import { ErrorRetryMiddleware } from '@prequest/error-retry'

const errorRetryMiddleware = new ErrorRetryMiddleware({
  retryCount: 3,
  retryControl(opt, e) {
    const { method } = opt
    if (isCancel(e)) return false
    return method === 'get'
  }
})

interface Request {
  enableCache?: boolean
}

const instance = create<Request, any>(wx.request, {
  baseURL: 'http://localhost:10000',
  enableCache: true
})

instance.use(errorRetryMiddleware.run)

const sleep = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(void 0)
  }, 3000)
})

instance.use(async (ctx, next) => {
  await sleep()
  await next()
  const { data } = ctx.response
  console.log('------', ctx.response)
  if (data === 'Internal Server Error') {
    throw new Error(data)
  }
})

const source = CancelToken.source()
export default function App(props: any) {
  useEffect(() => {
    instance.get('/api', {
      getNativeRequestInstance(native) {
        native.then(res => {
          console.log('拿到实例', res)
        })
      },
      cancelToken: source.token
    }).then(res => {
      console.log('查看结果', res)
    }).catch(e => {
      console.log('报错', e)
    })
  }, [])

  return props.children
}
