import { View } from '@tarojs/components'
import { useState } from 'react'
import { hideLoading, showLoading } from '@tarojs/taro'
import { prequest, lock } from '@common/http'

export default function () {
  const [data, setData] = useState('')
  const [token, setToken] = useState('')

  async function onMultiplyRequest() {
    showLoading()
    const taskList = [1, 2, 3, 4, 5, 6].map(num => prequest('/api', { params: { num } }))
    const res = await Promise.all(taskList)
    setData(JSON.stringify(res))

    const token = await lock.getValue()
    setToken(token)
    hideLoading()
  }

  async function onClear() {
    lock.clear()
    setToken('')
  }

  return (
    <View>
      <View onClick={onMultiplyRequest}>
        [wx.request] 点击这里同时进行 6 次请求，首先会请求 token 接口
      </View>
      <View>
        [token]: {token}
      </View>
      <View onClick={onClear}>清除 Token</View>
      <View>
        <View>响应结果</View>
        <View>
          {data}
        </View>
      </View>
    </View>
  )
}