import { View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'

export default function () {
  return (
    <View>
      <View onClick={() => navigateTo({ url: '/pages/common/index' })}>Common</View>
      <View onClick={() => navigateTo({ url: '/pages/upload/index' })}>Upload</View>
      <View onClick={() => navigateTo({ url: '/pages/download/index' })}>Download</View>
      <View onClick={() => navigateTo({ url: '/pages/token/index' })}>Token 校验</View>
    </View>
  )
}