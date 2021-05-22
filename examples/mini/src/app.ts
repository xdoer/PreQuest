import { useEffect } from "react"
import { create } from '@prequest/miniprogram'

interface Request {
  enableCache?: boolean
}

const instance = create<Request, any>(wx.request, {
  baseURL: 'http://localhost:10000',
  enableCache: true
})

export default function App(props: any) {
  useEffect(() => {
    instance.get('/api', {
      getNativeRequestInstance(native) {
        native.then(res => {
          console.log('拿到实例', res, res.abort())
        })
      }
    }).then(res => {
      console.log('查看结果', res)
    }).catch(e => {
      console.log('报错', e)
    })
  }, [])

  return props.children
}
