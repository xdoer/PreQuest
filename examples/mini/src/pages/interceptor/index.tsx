import { View } from '@tarojs/components'
import { useState } from 'react'
import { create } from '@prequest/miniprogram'
import { interceptorMiddleware } from '@common/interceptor'
import Taro from '@tarojs/taro'

const prequest = create(Taro.request, { baseURL: 'http://localhost:8080' })

prequest.use(interceptorMiddleware.run)

interceptorMiddleware.request.use(
  (opt) => {
    console.log('请求参数, opt', opt)
    return opt
  },
  (e) => {
    console.log('请求错误', e)
  }
)

interceptorMiddleware.response.use(
  (res) => {
    if (res.statusCode === 401) throw 'Unauthorized'
    return res
  },
  (e) => {
    throw e
  }
)

export default function () {
  const [data, setData] = useState('')

  async function onMultiplyRequest() {
    try {
      const xx = await prequest('/api', { params: { delay: 500 } })
      console.log('查看响应', xx)
    } catch (e) {
      console.log('catch报错', e)
    }
  }

  return (
    <View>
      <View onClick={onMultiplyRequest}>
        [wx.request] 点击这里同时进行 6 次请求，首先会请求 token 接口
      </View>
      <View>
        <View>响应结果</View>
        <View>
          {data}
        </View>
      </View>
    </View>
  )
}