import React, { FC, useState } from 'react'
import { prequest, create } from '@prequest/fetch'

export const FetchComponent: FC<{}> = ({ }) => {
  const [value, setValue] = useState('空')

  function reqClain() {
    prequest('http://localhost:10000/api', {})
      .then(res => {
        console.log('查看值', res)
        setValue(JSON.stringify(res))
      })
      .catch(e => {
        console.log('报错', e)
      })
  }

  function reqAlias() {
    prequest.post('http://localhost:10000/api')
      .then(res => {
        console.log('查看值', res)
        setValue(JSON.stringify(res))
      })
      .catch(e => {
        console.log('报错', e)
      })
  }

  function register() {
    const instance = create({ baseURL: 'http://localhost:10000', params: { a: 1 } })
    instance.get('/api').then(res => console.log('查看盒子', res))
  }

  return (
    <div>
      <div>fetch 组件</div>
      <div onClick={() => register()}>注册中间件</div>
      <div onClick={() => reqClain()}>链式调用</div>
      <div onClick={() => reqAlias()}>别名调用</div>
      <div>{value}</div>
    </div>
  )
}

