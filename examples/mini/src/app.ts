import "@tarojs/async-await"
import { useEffect } from "react"
import { create } from '@prequest/miniprogram'
import { CancelToken } from '@prequest/cancel-token'

interface Request {
  enableCache?: boolean
}

const instance = create<Request, any>(wx.request, {
  baseURL: 'http://localhost:10000',
  enableCache: true
})

const source = CancelToken.source()

const sleep = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(void 0)
  }, 3000)
})

instance.use(async (ctx, next) => {
  await sleep()
  await next()
})

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
    source.cancel('取消啦')
  }, [])

  return props.children
}
