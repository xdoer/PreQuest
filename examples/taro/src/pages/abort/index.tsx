import { View } from '@tarojs/components'
import { useState } from 'react'
import { create } from '@prequest/miniprogram'
import CancelToken from '@prequest/cancel-token'

const source = CancelToken.source()
const prequest = create(wx.request)

prequest.use(async (ctx, next) => {
  await next()
})

export default function () {
  const [data, setData] = useState('')

  async function onClick() {
    try {
      const res = await prequest({
        path: 'http://localhost:8080/api',
        cancelToken: source.token,
        params: {
          delay: 5000,
        }
      })
      setData(JSON.stringify(res))
    } catch (e) {
      console.log('查看错误', e)
    }
  }

  function request() {
    const xxx = wx.request({
      url: 'http://localhost:8080/api?delay=5000',
      success(d) {
        setData(JSON.stringify(d))
      },
      fail(e) {
        console.log('查看错误', e)
      }
    })

    xxx.abort()
  }

  return (
    <View>
      <View onClick={onClick}>
        [wx.request] 点击这里进行请求
      </View>
      <View onClick={() => source.cancel()}>
        点击取消请求
      </View>
      <View>
        <View>响应结果</View>
        <View>
          {data}
        </View>
      </View>

      <View>==============================</View>


      <View onClick={() => request()}>原始请求</View>
    </View>
  )
}