import { View } from '@tarojs/components'
import { useState } from 'react'
import { chooseImage, hideLoading, showLoading } from '@tarojs/taro'
import { wxUpload } from '@common/http'


export default function () {
  const [data, setData] = useState('')

  async function onClick() {
    chooseImage({
      async success(res) {
        const { tempFilePaths } = res
        const temp = tempFilePaths[0]
        showLoading()
        try {
          const xx = await wxUpload('/upload', { filePath: temp, name: 'file' })
          setData(xx)
        } catch (e) {
          console.log('查看报错信息', e)
        }
        hideLoading()
      },
      fail(e) {
        console.log('失败', e)
      }
    })
  }

  return (
    <View>
      <View onClick={onClick}>
        [wx.uploadFile] 点击上传
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