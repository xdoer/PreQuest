import { View } from '@tarojs/components'
import { createDownload } from '@prequest/miniprogram-addon'
import { CancelToken } from '@prequest/cancel-token'

const source = CancelToken.source()

const prequest = createDownload(wx.downloadFile)

export default function () {

  function onClick() {
    prequest('http://localhost:3000', {
      cancelToken: source.token
    }).then(res => {
      console.log('上传', res)
    }).catch(e => {
      console.log('报错啦', e)
    })
  }

  return (
    <View onClick={onClick}>
      上传
    </View>
  )
}