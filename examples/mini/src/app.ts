import { useEffect } from "react"
import { createPreQuest } from '@prequest/miniprogram'
import { graphql } from '@prequest/graphql'
import Taro from '@tarojs/taro'

const instance = createPreQuest(Taro.request, {
  baseURL: 'http://localhost:10000',
  path: '/graphql',
})

const instance2 = createPreQuest(Taro.request, {
  baseURL: 'http://localhost:10000',
})

const request = graphql(instance)


export default function App(props: any) {

  useEffect(() => {
    request(CONFIG)
      .then(res => {
        console.log('查看响应', res)
      })
      .catch(e => {
        console.log('查看报错', e)
      })

    instance2.get('/api').then(res => {
      console.log('查看restful', res)
    })
  }, [])

  return props.children
}

export const CONFIG = `
query config($config: String){
    config(config: $config){
        id
        config
        showUpdatedTime
    }
}
`;