import { View } from '@tarojs/components'
import { prequest, lock } from '@common/http'

export default function () {
  function common() {

  }

  return (
    <View>
      <View onClick={common}>普通请求</View>
    </View>
  )
}