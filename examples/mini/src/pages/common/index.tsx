import { View } from '@tarojs/components'
import { useState } from 'react'
import { hideLoading, showLoading } from '@tarojs/taro'
import { prequest } from '@common/http'

export default function () {
  const [data, setData] = useState('')

  async function onClick() {
    showLoading()
    const res = await prequest('/api')
    setData(JSON.stringify(res))
    hideLoading()
  }

  return (
    <View>
      <View onClick={onClick}>
        [wx.request] 点击这里进行请求
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